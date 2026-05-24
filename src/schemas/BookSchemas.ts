import { z } from 'zod';

export const createBookSchema = z.object({
    title: z.string().trim().min(1, 'Titulo requerido'),
    description: z.string().trim().optional(),
    isbn: z.string().trim().min(1, 'ISBN requerido'),
    authorId: z.string().trim().min(1, 'authorId requerido'),
    categoryId: z.string().trim().min(1, 'categoryId requerido'),
    editorialId: z.string().trim().min(1, 'editorialId requerido'),
});

export const updateBookSchema = z.object({
    title: z.string().trim().min(1, 'Titulo requerido').optional(),
    description: z.string().trim().optional(),
    isbn: z.string().trim().min(1, 'ISBN requerido').optional(),
    authorId: z.string().trim().min(1, 'authorId requerido').optional(),
    categoryId: z.string().trim().min(1, 'categoryId requerido').optional(),
    editorialId: z.string().trim().min(1, 'editorialId requerido').optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: 'Debe enviar al menos un campo',
});

export const bookIdParamsSchema = z.object({
    id: z.string().trim().min(1, 'id requerido'),
});

export const bookListQuerySchema = z.object({
    page: z.coerce.number().int().min(1, 'page debe ser >= 1').optional(),
    pageSize: z.coerce.number().int().min(1, 'pageSize debe ser >= 1').max(100, 'pageSize max 100').optional(),
});
