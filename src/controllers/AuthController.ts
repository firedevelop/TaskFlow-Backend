import type { Request, Response } from 'express';
import User from '../models/User';
import { checkPassword, hashPassword } from '../utils/auth';
import Token from '../models/Token';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';
import { generateJWT } from '../utils/jwt';

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body;

            // Comprobar si el email ya existe
            const userExists = await User.findOne({ email });

            if (userExists) {
                const error = new Error('El email ya está asociado a otra cuenta');
                res.status(409).json({ error: error.message });
                return;
            }

            const user = new User(req.body);

            // Hashear contraseña
            user.password = await hashPassword(password);

            // Generar token
            const token = new Token();
            token.token = generateToken();
            token.user = user.id;

            // Enviar email de confirmación de cuenta (temporalmente deshabilitado)
            // AuthEmail.sendConfirmationEmail({
            //     email: user.email,
            //     name: user.name,
            //     token: token.token
            // });

            await Promise.allSettled([token.save(), user.save()]);

            res.send('¡Cuenta creada correctamente! (Email temporalmente deshabilitado para testing)');

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body;

            // Comprobar si el token existe
            const tokenExists = await Token.findOne({ token });

            if (!tokenExists) {
                const error = new Error('El token no es válido');
                res.status(401).json({ error: error.message });
                return;
            }

            // Confirmar cuenta
            const user = await User.findById(tokenExists.user);
            user.confirmed = true;

            await Promise.allSettled([tokenExists.deleteOne(), user.save()]);

            res.send('¡Cuenta confirmada correctamente!');

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            // Comprobar si el usuario existe
            const user = await User.findOne({ email });

            if (!user) {
                const error = new Error('El usuario no existe');
                res.status(401).json({ error: error.message });
                return;
            }

            // Comprobar si la cuenta está confirmada
            if (!user.confirmed) {
                const token = new Token();
                token.user = user.id;
                token.token = generateToken();
                await token.save();

                // Enviar email
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                });

                const error = new Error('La cuenta no está confirmada, hemos enviado un email de verificación');
                res.status(401).json({ error: error.message });
                return;
            }

            // Comprobar si la contraseña es correcta
            const isPasswordCorrect = await checkPassword(password, user.password);

            if (!isPasswordCorrect) {
                const error = new Error('La contraseña es incorrecta');
                res.status(401).json({ error: error.message });
                return;
            }

            const token = generateJWT({ id: user.id });
            res.send(token);

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            // Comprobar si el email existe
            const user = await User.findOne({ email });

            if (!user) {
                const error = new Error('El usuario no está registrado');
                res.status(404).json({ error: error.message });
                return;
            }

            // Si la cuenta ya está confirmada
            if (user.confirmed) {
                const error = new Error('La cuenta ya está confirmada');
                res.status(403).json({ error: error.message });
                return;
            }

            // Generar token
            const token = new Token();
            token.token = generateToken();
            token.user = user.id;

            // Enviar email de confirmación de cuenta
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            });

            await Promise.allSettled([token.save(), user.save()]);

            res.send('Se ha enviado un nuevo código a tu email');

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            // Comprobar si el email existe
            const user = await User.findOne({ email });

            if (!user) {
                const error = new Error('El usuario no está registrado');
                res.status(404).json({ error: error.message });
                return;
            }

            // Generar token
            const token = new Token();
            token.token = generateToken();
            token.user = user.id;
            await token.save();

            // Enviar email de confirmación de cuenta
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            });

            res.send('Se ha enviado un email con las instrucciones');

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body;

            // Comprobar si el token existe
            const tokenExists = await Token.findOne({ token });

            if (!tokenExists) {
                const error = new Error('El token no es válido');
                res.status(404).json({ error: error.message });
                return;
            }

            res.send('Token válido, define tu nueva contraseña');

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static updatePassword = async (req: Request, res: Response) => {
        try {
            const { token } = req.params;
            const { password } = req.body;

            // Comprobar si el token existe
            const tokenExists = await Token.findOne({ token });

            if (!tokenExists) {
                const error = new Error('El token no es válido');
                res.status(404).json({ error: error.message });
                return;
            }

            const user = await User.findById(tokenExists.user);
            user.password = await hashPassword(password);
            await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

            res.send('¡Contraseña cambiada con éxito!');

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static user = async (req: Request, res: Response) => {
        res.json(req.user);
    }

    static updateProfile = async (req: Request, res: Response) => {
        try {
            const { name, email } = req.body;

            const userExists = await User.findOne({ email });

            // Si el email ya está registrado
            if (userExists && userExists.id.toString() !== req.user.id.toString()) {
                const error = new Error('El email ya está registrado');
                res.status(409).json({ error: error.message });
                return;
            }

            req.user.name = name;
            req.user.email = email;

            await req.user.save();
            res.send('¡Perfil actualizado correctamente!')

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static updateCurrentUserPassword = async (req: Request, res: Response) => {
        try {
            const { current_password, password } = req.body;

            const user = await User.findById(req.user.id);

            const isPasswordCorrect = await checkPassword(current_password, user.password);

            // Si la contraseña no es correcta
            if (!isPasswordCorrect) {
                const error = new Error('La contraseña actual es incorrecta');
                res.status(401).json({ error: error.message });
                return;
            }

            user.password = await hashPassword(password);
            await user.save();

            res.send('¡Contraseña cambiada correctamente!');

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    static checkPassword = async (req: Request, res: Response) => {
        try {
            const { password } = req.body;

            const user = await User.findById(req.user.id);

            const isPasswordCorrect = await checkPassword(password, user.password);

            // Si la contraseña no es correcta
            if (!isPasswordCorrect) {
                const error = new Error('La contraseña es incorrecta');
                res.status(401).json({ error: error.message });
                return;
            }

            res.send('¡La contraseña es correcta!')

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }
}