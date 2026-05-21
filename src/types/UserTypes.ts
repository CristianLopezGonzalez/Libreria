import { BookDTO } from "./BookTypes";

export interface UserDTO {
    id:string;
    nick:string;
    email:string;
    
    books?:BookDTO[]

    createdAt?:Date;
    updatedAt?:Date;


}

export interface CreateUserDTO {
    id:string;
    nick:string;
    email:string;
    password:string;
}

export interface UpdateUserDTO {
    nick?:string;
    email?:string;
}

export interface CreateUserDTOResponse {
    user: UserDTO;
    token: string;
}
