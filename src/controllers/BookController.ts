import { BookService } from '../services/BookService';
import { Request, Response } from 'express';
import { CreateBookDTO, CreateBookRequestDTO, UpdateBookDTO } from '../types/BookTypes';
import { ResponseHttp } from '../middlewares/ResponseHttp';

export class BookController {
    constructor(
        private bookService: BookService = new BookService(),
        private responseHttp: ResponseHttp = new ResponseHttp()

    ) {
        this.createBook = this.createBook.bind(this);
        this.getBookById = this.getBookById.bind(this);
        this.updateBook = this.updateBook.bind(this);
        this.deleteBook = this.deleteBook.bind(this);
        this.getAllBooks = this.getAllBooks.bind(this);

    }

    async createBook(req: Request<{}, {}, CreateBookRequestDTO>, res: Response) {
        try {

            const userId = req.user?.id;
            if (!userId) {
                return this.responseHttp.UNAUTHORIZED(res, 'User not authenticated');
            }

            const bookData: CreateBookDTO = { ...req.body, userId };
            const newBook = await this.bookService.createBook(bookData);
            return this.responseHttp.CREATED(res, newBook, 'Book created successfully');

        } catch (error) {
            console.error('Error creating book:', error);
            return this.responseHttp.INTERNAL_SERVER_ERROR(res, 'An error occurred while creating the book');
        }
    }

    async getBookById(req: Request<{ id: string }>, res: Response) {
        try {

            const { id } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                return this.responseHttp.UNAUTHORIZED(res, 'User not authenticated');
            }

            const book = await this.bookService.getBookById(id, userId);
            if (!book) {
                return this.responseHttp.OK(res)
            }
            return this.responseHttp.OK(res, book, 'Book fetched successfully');

        } catch (error) {
            console.error('Error fetching book by ID:', error);
            return this.responseHttp.INTERNAL_SERVER_ERROR(res, 'An error occurred while fetching the book');
        }
    }

    async updateBook(req: Request<{ id: string }, {}, UpdateBookDTO>, res: Response) {

        try {

            const { id } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                return this.responseHttp.UNAUTHORIZED(res, 'User not authenticated');
            }

            const bookData: UpdateBookDTO = req.body;
            const updatedBook = await this.bookService.updateBook(id, userId, bookData);
            if (!updatedBook) {
                return this.responseHttp.NOT_FOUND(res, 'Book not found');
            }
            return this.responseHttp.OK(res, updatedBook, 'Book updated successfully');

        } catch (error) {
            console.error('Error updating book:', error);
            return this.responseHttp.INTERNAL_SERVER_ERROR(res, 'An error occurred while updating the book');
        }

    }

    async deleteBook(req: Request<{ id: string }>, res: Response) {
        try {

            const { id } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                return this.responseHttp.UNAUTHORIZED(res, 'User not authenticated');
            }

            const deleted = await this.bookService.deleteBook(id, userId);
            if (!deleted) {
                return this.responseHttp.NOT_FOUND(res, 'Book not found');
            }
            return this.responseHttp.OK(res, null, 'Book deleted successfully');

        } catch (error) {
            console.error('Error deleting book:', error);
            return this.responseHttp.INTERNAL_SERVER_ERROR(res, 'An error occurred while deleting the book');
        }

    }

    async getAllBooks(req: Request<{}, {}, {}, { page?: string; pageSize?: string }>, res: Response) {
        try {
            const page = parseInt(req.query.page || '1');
            const pageSize = parseInt(req.query.pageSize || '10');

            const userId = req.user?.id;
            if (!userId) {
                return this.responseHttp.UNAUTHORIZED(res, 'User not authenticated');
            }
 
            if (isNaN(page) || page < 1) {
                return this.responseHttp.BAD_REQUEST(res, 'Page must be a positive integer');
            }
 
            if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) {
                return this.responseHttp.BAD_REQUEST(res, 'Page size must be a positive integer between 1 and 100');
            }
 
            const books = await this.bookService.getAllBooks(userId, page, pageSize);
            return this.responseHttp.OK(res, books, 'Books fetched successfully');
 
        } catch (error) {
            console.error('Error fetching books:', error);
            return this.responseHttp.INTERNAL_SERVER_ERROR(res, 'An error occurred while fetching the books');
        }
    }

}