import bcrypt from 'bcryptjs';

// Hashear contraseña de usuario
export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(15);
    return await bcrypt.hash(password, salt);
}

// Comprobar contraseña de usuario
export const checkPassword = async (enteredPassword: string, storedHash: string) => {
    return await bcrypt.compare(enteredPassword, storedHash);
}