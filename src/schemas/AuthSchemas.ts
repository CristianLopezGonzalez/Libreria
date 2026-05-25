import { z } from 'zod';

export const registerSchema = z.object({
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
});


export const loginSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email format')
        .toLowerCase(),
    password: z
        .string({ required_error: 'Password is required' })
        .min(1, 'Password is required')
});


export const refreshTokenSchema = z.object({
    refreshToken: z
        .string({ required_error: 'Refresh token is required' })
        .optional()
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
export type RefreshTokenDTO = z.infer<typeof refreshTokenSchema>;