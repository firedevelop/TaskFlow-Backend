import type { Request, Response } from "express"
import User from "../models/User";
import Project from "../models/Project";

export class TeamMemberController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            // Comprobar si el usuario existe
            const user = await User.findOne({ email }).select('id email name');

            if (!user) {
                const error = new Error('El usuario no existe');
                res.status(404).json({ error: error.message });
                return;
            }

            // Comprobar si el usuario es el mánager del proyecto
            if (req.project.manager.toString() === user.id.toString()) {
                const error = new Error('El usuario es el mánager del proyecto');
                res.status(409).json({ error: error.message });
                return;
            }

            // Comprobar si el usuario ya está en el equipo
            if (req.project.team.some(teamMember => teamMember.toString() === user.id.toString())) {
                const error = new Error('El usuario ya está en el equipo');
                res.status(409).json({ error: error.message });
                return;
            }

            res.json(user);

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static getProjectTeam = async (req: Request, res: Response) => {
        try {
            const project = (await Project.findById(req.project.id)).populate({
                path: 'team',
                select: 'id email name'
            });

            res.json((await project).team);

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static addMemberById = async (req: Request, res: Response) => {
        try {
            const { id } = req.body;

            // Comprobar si el usuario existe
            const user = await User.findById(id).select('id');

            if (!user) {
                const error = new Error('El usuario no existe');
                res.status(404).json({ error: error.message });
                return;
            }

            // Comprobar si el usuario es el mánager del proyecto
            if (req.project.manager.toString() === user.id.toString()) {
                const error = new Error('El usuario es el mánager del proyecto');
                res.status(409).json({ error: error.message });
                return;
            }

            // Comprobar si el usuario ya está en el equipo
            if (req.project.team.some(teamMember => teamMember.toString() === user.id.toString())) {
                const error = new Error('El usuario ya está en el equipo');
                res.status(409).json({ error: error.message });
                return;
            }

            req.project.team.push(user.id);
            await req.project.save();

            res.json('¡Usuario agregado correctamente!');

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static removeMemberById = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;

            // Comprobar si el usuario está el en proyecto
            if (!req.project.team.some(teamMember => teamMember.toString() === userId)) {
                const error = new Error('El usuario no está en el proyecto');
                res.status(409).json({ error: error.message });
                return;
            }

            req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId);
            await req.project.save();

            res.send('¡Usuario eliminado correctamente!');

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }
}