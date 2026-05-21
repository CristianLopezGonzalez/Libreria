import { Response, Request } from "express"
import { CategoryService } from "../services/CategoryService"
import { ResponseHttp } from "../middlewares/ResponseHttp"

export class CategoryController {

    constructor(
        private categoriesService: CategoryService = new CategoryService(),
        private responseHttp: ResponseHttp = new ResponseHttp()
    ) {
        this.getAllCategories = this.getAllCategories.bind(this);
        this.getCategoryById = this.getCategoryById.bind(this);
        this.createCategory = this.createCategory.bind(this);
    }

    async getAllCategories(req: Request, res: Response): Promise<Response> {
        try {

            const categories = await this.categoriesService.getCategories();
            return this.responseHttp.OK(res, categories, 'Categories fetched successfully');

        } catch (error) {
            console.error('Error fetching categories:', error);
            return this.responseHttp.INTERNAL_SERVER_ERROR(res, 'An error occurred while fetching categories');
        }
    }

    async getCategoryById(req: Request<{ id: string }>, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const category = await this.categoriesService.getCategoryById(id);
            return this.responseHttp.OK(res, category, 'Category fetched successfully');
        } catch (error) {
            console.error('Error fetching category by ID:', error);
            return this.responseHttp.INTERNAL_SERVER_ERROR(res, 'An error occurred while fetching the category');
        }
    }

    async createCategory(req: Request<{}, {}, { name: string }>, res: Response): Promise<Response> {
        try {

            const { name } = req.body;
            const newCategory = await this.categoriesService.createCategory(name);
            return this.responseHttp.CREATED(res, newCategory, 'Category created successfully');

        }catch (error) {
            console.error('Error creating category:', error);
            return this.responseHttp.INTERNAL_SERVER_ERROR(res, 'An error occurred while creating the category');
        }
    }
}