import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { hasAuthorization, taskBelongsToProject, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router();

router.use(authenticate);

router.post('/',
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción es obligatoria'),
    handleInputErrors,
    ProjectController.createProject
);

router.get('/', ProjectController.getAllProjects);
router.get('/:id',
    param('id')
        .isMongoId().withMessage('El ID no es válido'),
    handleInputErrors,
    ProjectController.getProjectById);

router.put('/:id',
    param('id')
        .isMongoId().withMessage('El ID no es válido'),
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción es obligatoria'),
    handleInputErrors,
    ProjectController.updateProject);

router.delete('/:id',
    param('id')
        .isMongoId().withMessage('El ID no es válido'),
    handleInputErrors,
    ProjectController.deleteProject);

/** Rutas de Tareas **/
router.param('projectId', projectExists);
router.param('taskId', taskExists);
router.param('taskId', taskBelongsToProject);

router.post('/:projectId/tasks',
    hasAuthorization,
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción es obligatoria'),
    handleInputErrors,
    TaskController.createTask);

router.get('/:projectId/tasks',
    TaskController.getProjectTasks);

router.get('/:projectId/tasks/:taskId',
    param('taskId')
        .isMongoId().withMessage('El ID no es válido'),
    TaskController.getTaskById);

router.put('/:projectId/tasks/:taskId',
    param('taskId')
        .isMongoId().withMessage('El ID no es válido'),
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción es obligatoria'),
    handleInputErrors,
    TaskController.updateTask);

router.delete('/:projectId/tasks/:taskId',
    param('taskId')
        .isMongoId().withMessage('El ID no es válido'),
    handleInputErrors,
    TaskController.deleteTask);

router.post('/:projectId/tasks/:taskId/status',
    param('taskId')
        .isMongoId().withMessage('El ID no es válido'),
    body('status')
        .notEmpty().withMessage('El estado no es válido'),
    handleInputErrors,
    TaskController.updateStatus);

/* Rutas del Equipo */
router.post('/:projectId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('El email no es válido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
);

router.get('/:projectId/team', TeamMemberController.getProjectTeam);

router.post('/:projectId/team',
    hasAuthorization,
    body('id')
        .isMongoId().withMessage('El ID no es válido'),
    handleInputErrors,
    TeamMemberController.addMemberById
);

router.delete('/:projectId/team/:userId',
    hasAuthorization,
    param('userId')
        .isMongoId().withMessage('El ID no es válido'),
    handleInputErrors,
    TeamMemberController.removeMemberById
);

/* Rutas de Tareas */
router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage('El contenido de la nota es obligatorio'),
    handleInputErrors,
    NoteController.createNote
);

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
);

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId')
        .isMongoId().withMessage('El ID no es válido'),
    NoteController.deleteNote
);

export default router;