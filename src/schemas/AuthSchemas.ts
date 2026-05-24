import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Email invalido'),
    password: z.string().min(6, 'Password minimo 6 caracteres'),
});

export const registerSchema = z.object({
    email: z.string().email('Email invalido'),
    password: z.string().min(6, 'Password minimo 6 caracteres'),
    nick: z.string().min(3, 'Nick minimo 3 caracteres'),
});
