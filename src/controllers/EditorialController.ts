import { ResponseHttp } from "../middlewares/ResponseHttp";
import { EditorialService } from "../services/EditorialService";
import { Request, Response, } from "express";

export class EditorialController {
    constructor(
        private editorialService: EditorialService = new EditorialService(),
        private responseHttp: ResponseHttp = new ResponseHttp()
    ) {
        this.getAllEditorials = this.getAllEditorials.bind(this);
        this.getEditorialById = this.getEditorialById.bind(this);
        this.createEditorial = this.createEditorial.bind(this);
    }

    async getAllEditorials(req: Request, res: Response): Promise<Response> {
        try {
            const editorial = await this.editorialService.getEditorials();
            return this.responseHttp.OK(res, editorial, 'Editorials fetched successfully');

        } catch (error) {
            console.error('Error fetching editorials:', error);
            return this.responseHttp.INTERNAL_SERVER_ERROR(res, 'An error occurred while fetching editorials');
        }
    }

    async getEditorialById(req: Request<{ id: string }>, res: Response): Promise<Response> {
        try {

            const { id } = req.params;
            const editorial = await this.editorialService.getEditorialById(id);
            return this.responseHttp.OK(res, editorial, 'Editorial fetched successfully');

        } catch (error) {
            console.error('Error fetching editorial by ID:', error);
            return this.responseHttp.INTERNAL_SERVER_ERROR(res, 'An error occurred while fetching the editorial');
        }
    }

    async createEditorial(req: Request<{}, {}, { name: string }>, res: Response): Promise<Response> {
        try {

            const { name } = req.body;
            const newEditorial = await this.editorialService.createEditorial(name);
            return this.responseHttp.CREATED(res, newEditorial, 'Editorial created successfully');

        } catch (error) {
            console.error('Error creating editorial:', error);
            return this.responseHttp.INTERNAL_SERVER_ERROR(res, 'An error occurred while creating the editorial');
        }
    }
}