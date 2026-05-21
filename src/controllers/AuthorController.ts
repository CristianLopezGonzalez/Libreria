import { ResponseHttp } from "../middlewares/ResponseHttp";
import { AuthorService } from "../services/AuthorService";
import { Request, Response } from "express";

export class AuthorController {

    constructor(
        private authorService: AuthorService = new AuthorService(),
        private responseHttp: ResponseHttp = new ResponseHttp()
    ) {
        this.getAllAuthors = this.getAllAuthors.bind(this);
        this.getAuthorById = this.getAuthorById.bind(this);
        this.createAuthor = this.createAuthor.bind(this);
    }

    async getAllAuthors(req: Request, res: Response): Promise<Response> {
        try {

            const authors = await this.authorService.getAuthors();
            return this.responseHttp.OK(res, authors, 'Authors fetched successfully');

        } catch (error) {
            console.error('Error fetching authors:', error);
            return this.responseHttp.INTERNAL_SERVER_ERROR(res, 'An error occurred while fetching authors');
        }
    }

    async getAuthorById(req: Request<{ id: string }>, res: Response): Promise<Response> {
        try {

            const { id } = req.params;
            const author = await this.authorService.getAuthorById(id);
            return this.responseHttp.OK(res, author, 'Author fetched successfully');

        } catch (error) {
            console.error('Error fetching author by ID:', error);
            return this.responseHttp.INTERNAL_SERVER_ERROR(res, 'An error occurred while fetching the author');
        }
    }

    async createAuthor(req: Request<{}, {}, { name: string }>, res: Response): Promise<Response> {
        try {

            const { name } = req.body;
            const newAuthor = await this.authorService.createAuthor(name);
            return this.responseHttp.CREATED(res, newAuthor, 'Author created successfully');

        } catch (error) {
            console.error('Error creating author:', error);
            return this.responseHttp.INTERNAL_SERVER_ERROR(res, 'An error occurred while creating the author');
        }
    }

}