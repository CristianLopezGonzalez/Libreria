import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { AuthUtils } from '../utils/AuthUtils';
import { ResponseHttp } from '../middlewares/ResponseHttp';
import { prisma } from '../config/prisma';

export class AuthController {
    constructor(
        private userService: UserService = new UserService(),
        private authUtils: AuthUtils = new AuthUtils(),
        private responseHttp: ResponseHttp = new ResponseHttp()
    ) {
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
        this.logout = this.logout.bind(this);
        this.getProfile = this.getProfile.bind(this);
    }

    async register(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password, nick } = req.body;

            const existingUser = await this.userService.getUserByEmail(email);
            const existingNick = await this.userService.getUserByNick(nick);

            if (existingNick) {
                return this.responseHttp.BAD_REQUEST(res, 'Nick already in use');
            }

            if (existingUser) {
                return this.responseHttp.BAD_REQUEST(res, 'Email already in use');
            }

            const newUser = await this.userService.createUser({
                email,
                password,
                nick
            });

            const payload = {
                id: newUser.user.id,
                nick: newUser.user.nick,
                role: newUser.user.role
            }

            const refreshToken = await this.authUtils.generateRefreshToken(payload);
            await this.userService.createRefreshToken(newUser.user.id, refreshToken);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return this.responseHttp.CREATED(res, {
                user: {
                    id: newUser.user.id,
                    email: newUser.user.email,
                    nick: newUser.user.nick,
                    role: newUser.user.role
                },
                token: newUser.token,
                message: 'User registered successfully. Please verify your email.'
            });

        } catch (error) {
            console.error('Error in register:', error);
            return this.responseHttp.INTERNAL_SERVER_ERROR(res, 'Error registering user');
        }
    }

    async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;

            const user = await this.userService.getUserByEmailWithPassword(email);

            if (!user) {
                return this.responseHttp.BAD_REQUEST(res, 'Invalid email or password');
            }

            const isPasswordValid = await this.authUtils.comparePassword(password, user.password);

            if (!isPasswordValid) {
                return this.responseHttp.BAD_REQUEST(res, 'Invalid email or password');
            }

            const payload = {
                id: user.id,
                nick: user.nick,
                role: user.role
            }

            const token = await this.authUtils.generateToken(payload);
            const refreshToken = await this.authUtils.generateRefreshToken(payload);
            await this.userService.createRefreshToken(user.id, refreshToken);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return this.responseHttp.OK(res, {
                user: {
                    id: user.id,
                    email: user.email,
                    nick: user.nick,
                    role: user.role,
                },
                token
            });

        } catch (error) {
            console.error('Error in login:', error);
            return this.responseHttp.INTERNAL_SERVER_ERROR(res, 'Error logging in');
        }
    }


    async refreshToken(req: Request, res: Response): Promise<Response> {
        try {
            const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

            if (!refreshToken || typeof refreshToken !== 'string') {
                return this.responseHttp.UNAUTHORIZED(res, 'Refresh token missing');
            }

            let decoded: any;
            try {
                decoded = await this.authUtils.verifyRefreshToken(refreshToken);
            } catch (tokenError: any) {
                if (tokenError.name === 'TokenExpiredError') {
                    await this.userService.deleteRefreshToken(refreshToken);
                    return this.responseHttp.UNAUTHORIZED(res, 'Refresh token has expired');
                }
                if (tokenError.name === 'JsonWebTokenError') {
                    return this.responseHttp.UNAUTHORIZED(res, 'Invalid refresh token');
                }
                throw tokenError;
            }

            const storedToken = await this.userService.getRefreshToken(refreshToken);
            if (!storedToken) {
                return this.responseHttp.UNAUTHORIZED(res, 'Refresh token not found');
            }

            if (storedToken.expiresAt < new Date()) {
                await this.userService.deleteRefreshToken(refreshToken);
                return this.responseHttp.UNAUTHORIZED(res, 'Refresh token has expired');
            }

            if (decoded?.id && decoded.id !== storedToken.userId) {
                return this.responseHttp.UNAUTHORIZED(res, 'Refresh token user mismatch');
            }

            const user = await this.userService.getUserById(storedToken.userId);
            if (!user) {
                return this.responseHttp.UNAUTHORIZED(res, 'User not found');
            }

            const payload = {
                id: user.id,
                nick: user.nick,
                role: user.role
            };

            const token = await this.authUtils.generateToken(payload);
            const newRefreshToken = await this.authUtils.generateRefreshToken(payload);
            await this.userService.createRefreshToken(user.id, newRefreshToken);
            await this.userService.deleteRefreshToken(refreshToken);

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return this.responseHttp.OK(res, { token });
        } catch (error: any) {
            console.error("Refresh token error:", error);
            return this.responseHttp.INTERNAL_SERVER_ERROR(res, error.message);
        }
    }

    async logout(req: Request, res: Response): Promise<Response> {
        try {
            const user = req.user;

            if (!user) {
                return this.responseHttp.UNAUTHORIZED(res, 'User not authenticated');
            }

            await prisma.refreshToken.deleteMany({
                where: { userId: user.id }
            });

            res.clearCookie('refreshToken');

            return this.responseHttp.OK(res, { message: 'Logged out successfully' });

        } catch (error: any) {
            console.error("Logout error:", error);
            return this.responseHttp.INTERNAL_SERVER_ERROR(res, error.message);
        }
    }

    async getProfile(req: Request, res: Response): Promise<Response> {
        try {
            const user = req.user;

            if (!user) {
                return this.responseHttp.UNAUTHORIZED(res, 'User not authenticated');
            }

            const userProfile = await this.userService.getUserById(user.id);

            return this.responseHttp.OK(res, userProfile);

        } catch (error: any) {
            console.error("Get profile error:", error);
            return this.responseHttp.INTERNAL_SERVER_ERROR(res, error.message);
        }
    }
}