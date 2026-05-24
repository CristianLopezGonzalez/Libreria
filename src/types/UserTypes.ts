import { BookDTO } from "./BookTypes";
import { Role } from "../generated/prisma/enums";

export interface UserDTO {
    id: string;
    nick: string;
    email: string;
    role: Role;

    books?: BookDTO[]

    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserWithPasswordDTO {
    [x: string]: any;
    id: string;
    nick: string;
    email: string;
    password: string;
    role: Role;
}

export interface CreateUserDTO {
    nick: string;
    email: string;
    password: string;
}

export interface EmailVerificationDTO extends CreateUserDTO {
    emailVerified: boolean;
    emailVerificationTokenHash: string;
    emailVerifyExpiresAt: Date;
}

export interface UpdateUserDTO {
    nick?: string;
    email?: string;
}

export interface CreateUserDTOResponse {
    user: UserDTO;
    token: string;
    emailVerificationToken?: string;
}

export interface AuthenticatedUser {
    id: string;
    nick: string;
    role: Role;
}

declare global {
    namespace Express {
        export interface Request {
            user?: AuthenticatedUser;
        }
    }
}