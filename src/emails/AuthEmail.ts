import { trasporter } from "../config/nodemailer"

interface IEmail {
    email: string,
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: IEmail) => {
        await trasporter.sendMail({
            from: 'UpTask <admin@uptask.com',
            to: user.email,
            subject: 'UpTask - Confirmar Cuenta',
            text: 'UpTask - Confirmar Cuenta',
            html: `
                <p>Hola ${user.name}, has creado tu cuenta en UpTask. Ya casi está todo listo, solo debes confirmar tu cuenta.</p>
                <p>Visita el siguiente enlace e ingresa el código: <b>${user.token}</b></p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>`
        });
    }

    static sendPasswordResetToken = async (user: IEmail) => {
        await trasporter.sendMail({
            from: 'UpTask <admin@uptask.com',
            to: user.email,
            subject: 'UpTask - Reestablece tu Contraseña',
            text: 'UpTask - Reestablece tu Contraseña',
            html: `
                <p>Hola ${user.name}, has solicitado un cambio de contraseña en UpTask.</p>
                <p>Visita el siguiente enlace e ingresa el código: <b>${user.token}</b></p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer Contraseña</a>`
        });
    }
}