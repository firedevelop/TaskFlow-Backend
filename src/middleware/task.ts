import type { Request, Response, NextFunction } from 'express';
import Task, { ITask } from '../models/Task';

declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}

export const taskExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId);

        if (!task) {
            const error = new Error('La tarea no existe');
            res.status(404).json({ error: error.message });
            return;
        }

        req.task = task;
        next();

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' });
    }
}

export const taskBelongsToProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Si la tarea no corresponde con el proyecto
        if (req.task.project.toString() !== req.project.id.toString()) {
            const error = new Error('La acción no es válida');
            res.status(400).json({ error: error.message });
            return;
        }

        next();

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' });
    }
}

export const hasAuthorization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Si la tarea no corresponde con el proyecto
        if (req.user.id.toString() !== req.project.manager.toString()) {
            const error = new Error('La acción no es válida');
            res.status(400).json({ error: error.message });
            return;
        }

        next();

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' });
    }
}


