import {prisma} from '../config/prisma';
import { Editorial } from '../types/EditorialTypes';

const EDITORIAL_SELECT = {
    id: true,
    name: true,
    createdAt: true,
    updatedAt: true
};

export class EditorialService {
    constructor() {
        this.createEditorial = this.createEditorial.bind(this);
        this.getEditorials = this.getEditorials.bind(this);
        this.getEditorialById = this.getEditorialById.bind(this);
    }

    async createEditorial(name: string): Promise<Editorial> {
        try {
            const editorial = await prisma.editorial.create({
                data: { name },
                select: EDITORIAL_SELECT
            });
            return editorial;
        } catch (error) {
            console.error('Error creating editorial:', error);
            throw error;
        }
    }

    async getEditorials(): Promise<Editorial[] | []> {
        try {

            const editorials = await prisma.editorial.findMany({
                select: EDITORIAL_SELECT
            });

            if (!editorials) {
                return [];
            }

            return editorials;

        }catch (error) {
            console.error('Error fetching editorials:', error);
            throw error;
        }
    }
    async getEditorialById(id: string): Promise<Editorial | null> {
        try {

            const editorial = await prisma.editorial.findUnique({
                where: { id },
                select: EDITORIAL_SELECT
            });

            if (!editorial) {
                return null;
            }

            return editorial;
        }catch (error) {
            console.error('Error fetching editorial:', error);
            throw error;
        }
    }
}