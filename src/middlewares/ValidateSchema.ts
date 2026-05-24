import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

export const validateBody = (schema: ZodTypeAny) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                path: issue.path.join('.'),
                message: issue.message,
            }));

            return res.status(400).json({
                status: 400,
                message: 'Validation error',
                errors,
            });
        }

        req.body = result.data;
        next();
    };
};

export const validateParams = (schema: ZodTypeAny) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.params);

        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                path: issue.path.join('.'),
                message: issue.message,
            }));

            return res.status(400).json({
                status: 400,
                message: 'Validation error',
                errors,
            });
        }

        req.params = result.data;
        next();
    };
};

export const validateQuery = (schema: ZodTypeAny) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                path: issue.path.join('.'),
                message: issue.message,
            }));

            return res.status(400).json({
                status: 400,
                message: 'Validation error',
                errors,
            });
        }

        req.query = result.data as any;
        next();
    };
};
