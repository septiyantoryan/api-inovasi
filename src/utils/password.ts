import bcrypt from 'bcrypt';

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12');

export const hashPassword = async (password: string): Promise<string> => {
    try {
        const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password');
    }
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error('Error comparing password');
    }
};

export const generateRandomPassword = (length: number = 12): string => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    return password;
};
