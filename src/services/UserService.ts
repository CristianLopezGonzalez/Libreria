import { prisma } from "../config/prisma";
import { CreateUserDTO, CreateUserDTOResponse, UserDTO, UpdateUserDTO } from "../types/UserTypes";
import { AuthUtils } from "../utils/AuthUtils";

const USER_SELECT = {
    id: true,
    nick: true,
    email: true,
    role: true,
};

export class UserService {

    constructor(
        private authUtils: AuthUtils = new AuthUtils()
    ) {
        this.getUserByNick = this.getUserByNick.bind(this);
        this.getUserByEmail = this.getUserByEmail.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.createUser = this.createUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
        this.getUserByEmailWithPassword = this.getUserByEmailWithPassword.bind(this);
        this.getRefreshToken = this.getRefreshToken.bind(this);
        this.deleteRefreshToken = this.deleteRefreshToken.bind(this);
    }

    async getUserByNick(nick: string): Promise<UserDTO | null> {
        try {

            const user = await prisma.user.findUnique({
                where: { nick },
                select: USER_SELECT
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
                select: USER_SELECT
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
                select: USER_SELECT
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

    async getAllUsers(): Promise<UserDTO[] | []> {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    nick: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                }
            });

            if (!users) {
                return [];
            }

            return users;
        } catch (error) {
            console.error("Error fetching all users:", error);
            throw new Error("Failed to fetch all users");
        }
    }

    async createUser(data: CreateUserDTO): Promise<CreateUserDTOResponse> {
        try {

            const existUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email: data.email },
                        { nick: data.nick }
                    ]
                }
            })

            if (existUser) {
                throw new Error("User already exists");
            }

            const hashedPassword = await this.authUtils.hashPassword(data.password);

            const user = await prisma.user.create({
                data: {
                    nick: data.nick,
                    email: data.email,
                    password: hashedPassword,
                },
                select: USER_SELECT
            })

            const token = await this.authUtils.generateToken({ id: user.id, email: user.email, role: user.role });

            return {
                user,
                token,
            }

        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Failed to create user");
        }
    }

    async createRefreshToken(userId: string, refreshToken: string): Promise<void> {
        try {
            await prisma.refreshToken.create({
                data: {
                    userId,
                    refreshToken,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                }
            });
        } catch (error) {
            console.error("Error creating refresh token:", error);
            throw new Error("Failed to create refresh token");
        }
    }

    async getRefreshToken(refreshToken: string): Promise<{ userId: string; expiresAt: Date; refreshToken: string } | null> {
        try {
            const token = await prisma.refreshToken.findUnique({
                where: { refreshToken },
                select: {
                    userId: true,
                    expiresAt: true,
                    refreshToken: true,
                }
            });

            return token || null;
        } catch (error) {
            console.error("Error fetching refresh token:", error);
            throw new Error("Failed to fetch refresh token");
        }
    }

    async deleteRefreshToken(refreshToken: string): Promise<void> {
        try {
            await prisma.refreshToken.deleteMany({
                where: { refreshToken }
            });
        } catch (error) {
            console.error("Error deleting refresh token:", error);
            throw new Error("Failed to delete refresh token");
        }
    }

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

        } catch (error) {
            console.error("Error updating user:", error);
            throw new Error("Failed to update user");
        }
    }

    async getUserByEmailWithPassword(email: string): Promise<any | null> {
        try {
            const user = await prisma.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    nick: true,
                    email: true,
                    password: true,
                    role: true,
                }
            });
            return user;
        } catch (error) {
            console.error("Error fetching user by email with password:", error);
            throw new Error("Failed to fetch user by email");
        }
    }


}