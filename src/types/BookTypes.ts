export interface BookDTO {
    id: string;
    title: string;
    description: string;
    user: {
        id: string;
    };
    author: {
        name: string;
    }
    category: {
        name: string;
    }

    editorial: {
        name: string;
    }
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateBookDTO {
    title: string;
    description: string;
    isbn :string;
    userId: string;
    authorId: string;
    categoryId: string;
    editorialId:string;
    
}

export interface UpdateBookDTO{
    title?: string;
    description?: string;
    isbn?: string;
    authorId?: string;
    categoryId?: string;
    editorialId?:string;
}

export interface BookPagedDTO {
    books: BookDTO[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}