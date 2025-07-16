import mongoose from 'mongoose';
import colors from 'colors';
import { exit } from 'node:process';

export const connectDB = async () => {
    try {
        // Conexión a la base de datos
        const { connection } = await mongoose.connect(process.env.DATABASE_URL);
        const url = `${connection.host}:${connection.port}`;
        console.log(colors.magenta.bold(`MongoDB conectado en: ${url}`))

    } catch (error) {
        console.log(colors.red.bold('Error al conectar a la base de datos'));
        exit(1); // Terminar la conexión con mensaje de error
    }
}