import { prisma } from "../config/prisma";
import { CreateBookDTO, BookDTO, UpdateBookDTO, BookPagedDTO } from "../types/BookTypes";

const BOOKS_SELECT = {
    id: true,
    title: true,
    description: true,
    isbn: true,
    user: {
        select: {
            id: true,
            nick: true
        },
    },
    author: {
        select: {
            name: true
        }
    },
    category: {
        select: {
            name: true
        }
    },
    editorial: {
        select: {
            name: true
        }
    },
    createdAt: true,
    updatedAt: true
}

export class BookService {

    constructor() {
        this.getBookById = this.getBookById.bind(this);
        this.createBook = this.createBook.bind(this);
        this.deleteBook = this.deleteBook.bind(this);
        this.updateBook = this.updateBook.bind(this);
        this.getAllBooks = this.getAllBooks.bind(this);
    }

    async getAllBooks(userId: string, page = 1, pageSize = 10): Promise<BookPagedDTO> {
        try {
            const safePage = Math.max(1, page);
            const safePageSize = Math.min(50, Math.max(1, pageSize));
            const skip = (safePage - 1) * safePageSize;

            const [data, total] = await prisma.$transaction([

                prisma.book.findMany({
                    where: { userId },
                    skip,
                    take: safePageSize,
                    select: BOOKS_SELECT,
                    orderBy: { createdAt: 'desc' }
                }),
                prisma.book.count({ where: { userId } })
            ])

            return {
                books: data,
                total,
                page: safePage,
                pageSize: safePageSize,
                totalPages: Math.ceil(total / safePageSize)
            }

        } catch (error) {
            console.error("Error fetching all books:", error);
            throw new Error("Failed to fetch all books");
        }
    }

    async getBookById(id: string, userId: string): Promise<BookDTO | null> {

        try {

            const book = await prisma.book.findFirst({
                where: {
                    id,
                    userId
                },
                select: BOOKS_SELECT
                
            })

            if (!book) {
                return null;
            }

            return book;

        } catch (error) {
            console.error("Error fetching book by ID:", error);
            throw new Error("Failed to fetch book by ID");
        }

    }

    async createBook(bookData: CreateBookDTO): Promise<BookDTO | []> {
        try {

            const newBook = await prisma.book.create({
                data: bookData,
                select: BOOKS_SELECT
            })

            if (!newBook) {
                return [];
            }

            return newBook;

        } catch (error) {
            console.error("Error creating book:", error);
            throw new Error("Failed to create book");
        }
    }

    async deleteBook(id: string, userId: string): Promise<boolean> {
        try {

            const existing = await prisma.book.findFirst({
                where: {
                    id,
                    userId
                },
                select: { id: true }
            });

            if (!existing) {
                return false;
            }

            await prisma.book.delete({
                where: {
                    id
                }
            });

            return true;

        } catch (error) {
            console.error("Error deleting book:", error);
            throw new Error("Failed to delete book");
        }
    }

    async updateBook(id: string, userId: string, bookData: UpdateBookDTO): Promise<BookDTO | null> {
        try {

            const existing = await prisma.book.findFirst({
                where: {
                    id,
                    userId
                },
                select: { id: true }
            });

            if (!existing) {
                return null;
            }

            const updatedBook = await prisma.book.update({
                where: {
                    id
                },
                data: bookData,
                select: BOOKS_SELECT
            })

            if (!updatedBook) {
                return null;
            }

            return updatedBook;

        } catch (error) {
            console.error("Error updating book:", error);
            throw new Error("Failed to update book");
        }
    }
}
