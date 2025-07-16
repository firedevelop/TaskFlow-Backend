import type { Request, Response } from 'express';
import Project from '../models/Project';

export class ProjectController {
    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    { manager: { $in: req.user.id } },
                    { team: { $in: req.user.id } }
                ]
            });
            res.json(projects);

        } catch (error) {
            console.log(error);
        }
    }

    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body);

        try {
            // Asignar un mánager al proyecto
            project.manager = req.user.id;
            await project.save();

            res.send('¡Proyecto creado correctamente!');

        } catch (error) {
            console.log(error);
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const project = await Project.findById(id)
            .populate({
                path: 'tasks',
                populate: [
                    { path: 'completedBy.user', select: 'id name email' },
                    { path: 'notes', populate: { path: 'createdBy', select: 'id name email' } }
                ]
            });

            // Si el proyecto no existe
            if (!project) {
                const error = new Error('El proyecto no existe');
                res.status(404).json({ error: error.message });
                return;
            }

            // Comprobar que el manager del proyecto sea el que lo solicita
            if (project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                const error = new Error('Acción no válida');
                res.status(401).json({ error: error.message });
                return;
            }

            res.json(project);

        } catch (error) {
            console.log(error);
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const project = await Project.findById(id);

            // Si el proyecto no existe
            if (!project) {
                const error = new Error('El proyecto no existe');
                res.status(404).json({ error: error.message });
                return;
            }

            // Comprobar que el manager del proyecto sea el que lo solicita
            if (project.manager.toString() !== req.user.id.toString()) {
                const error = new Error('Acción no válida');
                res.status(401).json({ error: error.message });
                return;
            }

            project.projectName = req.body.projectName;
            project.clientName = req.body.clientName;
            project.description = req.body.description;
            await project.save();

            res.send('¡Proyecto actualizado correctamente!');

        } catch (error) {
            console.log(error);
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const project = await Project.findById(id);

            // Si el proyecto no existe
            if (!project) {
                const error = new Error('El proyecto no existe');
                res.status(404).json({ error: error.message });
                return;
            }

            // Comprobar que el manager del proyecto sea el que lo solicita
            if (project.manager.toString() !== req.user.id.toString()) {
                const error = new Error('Acción no válida');
                res.status(401).json({ error: error.message });
                return;
            }

            await project.deleteOne();
            res.send('¡Proyecto eliminado correctamente!');

        } catch (error) {
            console.log(error);
        }
    }
}