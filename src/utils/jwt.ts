import jwt from 'jsonwebtoken';

interface TokenPayload {
    userId: number;
    username: string;
    role: string;
}

export const generateToken = (payload: TokenPayload): string => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRE || '7d';

    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    // Using any to bypass TypeScript strict checking for now
    return (jwt as any).sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string): TokenPayload => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    try {
        const decoded = jwt.verify(token, secret) as TokenPayload;
        return decoded;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

export const generateRefreshToken = (payload: TokenPayload): string => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return (jwt as any).sign(payload, secret, { expiresIn: '30d' });
};