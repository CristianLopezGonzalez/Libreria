import { prisma } from '../config/prisma';
import { Author } from '../types/AuthorTypes';

const AUTOR_SELECT = {
    id: true,
    name: true,
    createdAt: true,
    updatedAt: true,
}

export class AuthorService {
    constructor() {
        this.createAuthor = this.createAuthor.bind(this);
        this.getAuthors = this.getAuthors.bind(this);
        this.getAuthorById = this.getAuthorById.bind(this);
    }

    async createAuthor(name: string) {
        try {

            const newAuthor = await prisma.author.create({
                data: {
                    name,
                },
                select: AUTOR_SELECT
            });

            return newAuthor;

        } catch (error) {
            console.error('Error creating author:', error);
            throw error;
        }
    }

    async getAuthors(): Promise<Author[] | []> {
        try {
            const authors = await prisma.author.findMany({
                select: AUTOR_SELECT
            });
            
            if (!authors) {
                return [];
            }

            return authors;
        } catch (error) {
            console.error('Error fetching authors:', error);
            throw error;
        }
    }

    async getAuthorById(id: string): Promise<Author | null> {
        try {

            const author = await prisma.author.findUnique({
                where: { id },
                select: AUTOR_SELECT
            });

            if (!author) {
                return null;
            }

            return author;

        }catch (error) {
            console.error('Error fetching author by ID:', error);
            throw error;
        }
    }
}