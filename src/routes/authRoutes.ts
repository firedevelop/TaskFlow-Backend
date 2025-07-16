import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('El nombre no es válido'),
    body('email')
        .isEmail().withMessage('El email no es válido'),
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres'),
    body('password_confirmation')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden')
            }
            return true;
        }),
    handleInputErrors,
    AuthController.createAccount
);

router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage('El token no es válido'),
    handleInputErrors,
    AuthController.confirmAccount
);

router.post('/login',
    body('email')
        .isEmail().withMessage('El email no es válido'),
    body('password')
        .notEmpty().withMessage('La contraseña no es válida'),
    handleInputErrors,
    AuthController.login
);

router.post('/request-code',
    body('email')
        .isEmail().withMessage('El email no es válido'),
    handleInputErrors,
    AuthController.requestConfirmationCode
);

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('El email no es válido'),
    handleInputErrors,
    AuthController.forgotPassword
);

router.post('/validate-token',
    body('token')
        .notEmpty().withMessage('El token no es válido'),
    handleInputErrors,
    AuthController.validateToken
);

router.post('/update-password/:token',
    param('token')
        .isNumeric().withMessage('El token no es válido'),
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres'),
    body('password_confirmation')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden')
            }
            return true;
        }),
    handleInputErrors,
    AuthController.updatePassword
);

router.get('/user',
    authenticate,
    AuthController.user
);

router.put('/profile',
    authenticate,
    body('name')
        .notEmpty().withMessage('El nombre no es válido'),
    body('email')
        .isEmail().withMessage('El email no es válido'),
    handleInputErrors,
    AuthController.updateProfile
);

router.put('/update-password',
    authenticate,
    body('current_password')
        .notEmpty().withMessage('La contraseña actual es obligatoria'),
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener mínimo 8 caracteres'),
    body('password_confirmation')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden')
            }
            return true;
        }),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
);

router.post('/check-password',
    authenticate,
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),
    handleInputErrors,
    AuthController.checkPassword
);

export default router;