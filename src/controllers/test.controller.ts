import { Request, Response } from 'express';

export const testCheck = (req: Request, res: Response): void => {
    res.status(200).json({
        status: 'OK',
        message: 'Test endpoint is working',
        timestamp: new Date().toISOString()
    });
};

export const welcome = (req: Request, res: Response): void => {
    res.json({
        message: 'Welcome to INOVASI Backend API',
        version: '1.0.0'
    });
};
