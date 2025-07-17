import mongoose from 'mongoose';
import User from './src/models/User';
import dotenv from 'dotenv';
import colors from 'colors';

dotenv.config();

const checkUsers = async () => {
    try {
        // Conectar a la base de datos
        await mongoose.connect(process.env.DATABASE_URL!);
        console.log(colors.green('✅ Conectado a MongoDB Atlas'));

        // Buscar todos los usuarios
        const users = await User.find({}, 'name email confirmed');
        
        console.log(colors.cyan(`\n📊 Total de usuarios: ${users.length}\n`));
        
        if (users.length === 0) {
            console.log(colors.yellow('⚠️  No hay usuarios en la base de datos'));
            console.log(colors.blue('💡 Necesitas crear una cuenta primero usando el endpoint /api/auth/create-account'));
        } else {
            console.log(colors.blue('👤 Usuarios encontrados:'));
            users.forEach((user, index) => {
                console.log(colors.white(`${index + 1}. Email: ${user.email}`));
                console.log(colors.white(`   Nombre: ${user.name}`));
                console.log(colors.white(`   Confirmado: ${user.confirmed ? '✅' : '❌'}`));
                console.log('');
            });
        }

        await mongoose.disconnect();
        console.log(colors.green('🔌 Desconectado de MongoDB'));

    } catch (error) {
        console.error(colors.red('❌ Error:'), error);
    }
};

checkUsers();
