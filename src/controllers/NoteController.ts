import type { Request, Response } from 'express';
import Note from '../models/Note';

export class NoteController {
    static createNote = async (req: Request, res: Response) => {
        try {
            const { content } = req.body;

            const note = new Note();
            note.content = content;
            note.createdBy = req.user.id;
            note.task = req.task.id;

            req.task.notes.push(note.id);

            await Promise.allSettled([req.task.save(), note.save()]);
            res.send('¡Nota creada correctamente!');

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static getTaskNotes = async (req: Request, res: Response) => {
        try {
            const notes = await Note.find({ task: req.task.id });

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static deleteNote = async (req: Request, res: Response) => {
        try {
            const { noteId } = req.params;

            const note = await Note.findById(noteId);

            // Si la nota no existe
            if (!note) {
                const error = new Error('La nota no existe');
                res.status(404).json({ error: error.message });
                return;
            }

            // Si el autor no es el que está eliminando la nota
            if (note.createdBy.toString() !== req.user.id.toString()) {
                const error = new Error('La acción no es válida');
                res.status(401).json({ error: error.message });
                return;
            }

            req.task.notes = req.task.notes.filter(note => note.toString() !== noteId.toString());

            await Promise.allSettled([req.task.save(), note.deleteOne()]);
            res.send('¡Nota eliminada correctamente!');

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }
}