import { prisma } from "../config/prisma";
import { CreateUserDTO, CreateUserDTOResponse, UserDTO,UpdateUserDTO } from "../types/UserTypes";
export class UserService {

    constructor() {
        this.getUserByNick = this.getUserByNick.bind(this);
        this.getUserByEmail = this.getUserByEmail.bind(this);
        this.getUserById = this.getUserById.bind(this);
        //this.createUser = this.createUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
    }

    async getUserByNick(nick: string): Promise<UserDTO | null> {
        try {

            const user = await prisma.user.findUnique({
                where: { nick },
                select: {
                    id: true,
                    nick: true,
                    email: true,
                }
            });

            if (!user) {
                return null;
            }

            return user;

        } catch (error) {
            console.error("Error fetching user by nick:", error);
            throw new Error("Failed to fetch user by nick");
        }
    }

    async getUserByEmail(email: string): Promise<UserDTO | null> {
        try {

            const user = await prisma.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    nick: true,
                    email: true,
                }
            });

            if (!user) {
                return null;
            }

            return user;

        } catch (error) {
            console.error("Error fetching user by email:", error);
            throw new Error("Failed to fetch user by email");
        }
    }

    async getUserById(id: string): Promise<UserDTO | null> {
        try {

            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    nick: true,
                    email: true,
                }
            });

            if (!user) {
                return null;
            }

            return user;

        } catch (error) {
            console.error("Error fetching user by id:", error);
            throw new Error("Failed to fetch user by id");
        }
    }

    //async createUser(data: CreateUserDTO): Promise<CreateUserDTOResponse> {}

    async deleteUser(id: string) {
        try {
            await prisma.user.delete({
                where: { id },
            });
        } catch (error) {
            console.error("Error deleting user:", error);
            throw new Error("Failed to delete user");
        }
    }

    async updateUser(data: UpdateUserDTO, id: string): Promise<{ message: string }> {
        try {

            await prisma.user.update({
                where: { id },
                data: {
                    nick: data.nick,
                    email: data.email,
                }
            })

            return {
                message: "User updated successfully"
            }

            }catch (error) {
                console.error("Error updating user:", error);
                throw new Error("Failed to update user");
            }
        }

    async getAllUsers(): Promise < UserDTO[] | [] > {
            try {
                const users = await prisma.user.findMany({
                    select: {
                        id: true,
                        nick: true,
                        email: true,
                        createdAt: true,
                        updatedAt: true,
                    }
                });

                if(!users) {
                    return [];
                }

            return users;
            } catch(error) {
                console.error("Error fetching all users:", error);
                throw new Error("Failed to fetch all users");
            }
        }



    }