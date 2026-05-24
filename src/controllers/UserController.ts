import {UserService} from "../services/UserService";
import {Request, Response} from "express";
import {CreateUserDTO, UpdateUserDTO} from "../types/UserTypes";
import {ResponseHttp} from "../middlewares/ResponseHttp";

export class UserController {
    constructor(
        private userService: UserService = new UserService(),
        private responseHttp: ResponseHttp = new ResponseHttp()
    ) {
        this.getUserById = this.getUserById.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
        this.createUser = this.createUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    async getUserById(req: Request<{ id: string }>, res: Response) {
        try {

            const { id } = req.params;
            const user = await this.userService.getUserById(id);
            if (!user) {
                return this.responseHttp.NOT_FOUND(res, 'User not found');
            }

            return this.responseHttp.OK(res, user, 'User fetched successfully');

        }catch (error) {
            console.error('Error fetching user by ID:', error);
            return this.responseHttp.INTERNAL_SERVER_ERROR(res, 'An error occurred while fetching the user');
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {

            const users = await this.userService.getAllUsers();
            return this.responseHttp.OK(res, users, 'Users fetched successfully');

        }catch (error) {
            console.error('Error fetching all users:', error);
            return this.responseHttp.INTERNAL_SERVER_ERROR(res, 'An error occurred while fetching users');
        }
    }

    async createUser(req: Request<{}, {}, CreateUserDTO>, res: Response) {
        try {

            const userData: CreateUserDTO = req.body;
            const result = await this.userService.createUser(userData);
            return this.responseHttp.CREATED(res, result, 'User created successfully');

        }catch (error) {
            console.error('Error creating user:', error);
            return this.responseHttp.INTERNAL_SERVER_ERROR(res, 'An error occurred while creating the user');
        }
    }

    async updateUser(req: Request<{ id: string }, {}, UpdateUserDTO>, res: Response) {
        try {

            const { id } = req.params;
            const userData: UpdateUserDTO = req.body;
            const result = await this.userService.updateUser(userData, id);
            return this.responseHttp.OK(res, result, 'User updated successfully');

        }catch (error) {
            console.error('Error updating user:', error);
            return this.responseHttp.INTERNAL_SERVER_ERROR(res, 'An error occurred while updating the user');
        }
    }

    async deleteUser(req: Request<{ id: string }>, res: Response) {
        try {

            const { id } = req.params;
            const userId = req.user?.id;

            if (userId !== id) {
                return this.responseHttp.FORBIDDEN(res, 'You are not authorized to delete this user');
            }

            await this.userService.deleteUser(id);
            return this.responseHttp.OK(res, null, 'User deleted successfully');

        }catch (error) {
            console.error('Error deleting user:', error);
            return this.responseHttp.INTERNAL_SERVER_ERROR(res, 'An error occurred while deleting the user');
        }
    }

}