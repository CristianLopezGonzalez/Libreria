import { prisma } from '../config/prisma';
import { Category } from '../types/CategoryType';

const CATEGORY_SELECT = {
    id: true,
    name: true,
    createdAt: true,
    updatedAt: true
};

export class CategoryService {
    constructor() {
        this.createCategory = this.createCategory.bind(this);
        this.getCategories = this.getCategories.bind(this);
        this.getCategoryById = this.getCategoryById.bind(this);
    }

    async createCategory(name: string): Promise<Category> {
        try {
            const category = await prisma.category.create({
                data: { name },
                select: CATEGORY_SELECT
            })

            return category;

        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    }

    async getCategories(): Promise<Category[] | []> {
        try {
            const categories = await prisma.category.findMany({
                select: CATEGORY_SELECT
            });

            if (!categories) {
                return [];
            }

            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }

    async getCategoryById(id: string): Promise<Category | null> {
        try {
            const category = await prisma.category.findUnique({
                where: { id },
                select: CATEGORY_SELECT
            });

            if (!category) {
                return null;
            }

            return category;
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error;
        }
    }
}