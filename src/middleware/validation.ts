import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            // Validate the request using the provided schema
            const validatedData = schema.parse({
                body: req.body,
                params: req.params,
                query: req.query
            }) as any;

            // Replace request data with validated and transformed data
            if (validatedData.body) req.body = validatedData.body;
            if (validatedData.params) req.params = validatedData.params;
            if (validatedData.query) req.query = validatedData.query;

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message
                }));

                res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: errorMessages
                });
                return;
            }

            // Handle other types of errors
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    };
};
