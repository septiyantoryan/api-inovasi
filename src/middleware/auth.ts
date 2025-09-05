import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: string;
    };
}export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        res.status(401).json({
            error: 'Unauthorized',
            message: 'Access token is required',
        });
        return;
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const decoded = jwt.verify(token, secret) as any;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({
            error: 'Forbidden',
            message: 'Invalid or expired token',
        });
    }
};

export const authorizeRole = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Authentication required',
            });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                error: 'Forbidden',
                message: 'Insufficient permissions',
            });
            return;
        }

        next();
    };
};
