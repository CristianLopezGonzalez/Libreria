import { z } from 'zod';

/**
 * Schema para registro de usuario
 */
export const registerSchema = z.object({
    body: z.object({
        email: z
            .string({ required_error: 'Email is required' })
            .email('Invalid email format')
            .toLowerCase(),
        password: z
            .string({ required_error: 'Password is required' })
            .min(8, 'Password must be at least 8 characters')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                'Password must contain uppercase, lowercase, number and special character'
            ),
        nick: z
            .string({ required_error: 'Nick is required' })
            .min(3, 'Nick must be at least 3 characters')
            .max(20, 'Nick must not exceed 20 characters')
            .regex(/^[a-zA-Z0-9_-]+$/, 'Nick can only contain letters, numbers, underscores and hyphens')
    })
});

/**
 * Schema para login
 */
export const loginSchema = z.object({
    body: z.object({
        email: z
            .string({ required_error: 'Email is required' })
            .email('Invalid email format')
            .toLowerCase(),
        password: z
            .string({ required_error: 'Password is required' })
            .min(1, 'Password is required')
    })
});

/**
 * Schema para verificación de email
 */
export const verifyEmailSchema = z.object({
    body: z.object({
        email: z
            .string({ required_error: 'Email is required' })
            .email('Invalid email format')
            .toLowerCase(),
        token: z
            .string({ required_error: 'Token is required' })
            .min(64, 'Invalid token')
    })
});

/**
 * Schema para reenviar email de verificación
 */
export const resendVerificationEmailSchema = z.object({
    body: z.object({
        email: z
            .string({ required_error: 'Email is required' })
            .email('Invalid email format')
            .toLowerCase()
    })
});

/**
 * Schema para refresh token (opcional, en caso de usar body)
 */
export const refreshTokenSchema = z.object({
    body: z.object({
        refreshToken: z
            .string({ required_error: 'Refresh token is required' })
            .optional()
    })
});

// DTOs para typage
export type RegisterDTO = z.infer<typeof registerSchema>['body'];
export type LoginDTO = z.infer<typeof loginSchema>['body'];
export type VerifyEmailDTO = z.infer<typeof verifyEmailSchema>['body'];
export type ResendVerificationEmailDTO = z.infer<typeof resendVerificationEmailSchema>['body'];