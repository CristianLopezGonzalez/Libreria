import { Request, Response, NextFunction } from 'express';
import { AuthUtils } from '../utils/AuthUtils';
import { ResponseHttp } from './ResponseHttp';
import { AuthenticatedUser } from '../types/UserTypes';
import { Role } from '../generated/prisma/enums';

export class AuthMiddleware {
    constructor(
        private authUtils: AuthUtils = new AuthUtils(),
        private responseHttp: ResponseHttp = new ResponseHttp()
    ) {
        this.authenticate = this.authenticate.bind(this);
        this.permitRoles = this.permitRoles.bind(this);
    }

    async authenticate(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || typeof authHeader !== 'string') {
                return this.responseHttp.UNAUTHORIZED(res, 'Authorization header missing');
            }

            const parts = authHeader.split(' ');

            if (parts.length !== 2 || parts[0] !== 'Bearer') {
                return this.responseHttp.UNAUTHORIZED(res, 'Invalid authorization header format');
            }

            const token = parts[1];

            if (!token || token.trim() === '') {
                return this.responseHttp.UNAUTHORIZED(res, 'Token is empty');
            }

            try {
                const decoded = await this.authUtils.verifyToken(token);

                req.user = {
                    id: decoded.id,
                    nick: decoded.nick,
                    role: decoded.role
                } as AuthenticatedUser;

                next();
            } catch (tokenError: any) {
                if (tokenError.name === 'TokenExpiredError') {
                    return this.responseHttp.UNAUTHORIZED(res, 'Token has expired');
                }
                if (tokenError.name === 'JsonWebTokenError') {
                    return this.responseHttp.UNAUTHORIZED(res, 'Invalid token');
                }
                throw tokenError;
            }

        } catch (error) {
            console.error("Authentication error:", error);
            return this.responseHttp.UNAUTHORIZED(res, 'Authentication failed');
        }
    }


    permitRoles(allowedRoles: Role[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            const user = req.user;

            if (!user) {
                return this.responseHttp.UNAUTHORIZED(res, 'User not authenticated');
            }

            if (!allowedRoles || allowedRoles.length === 0) {
                return this.responseHttp.INTERNAL_SERVER_ERROR(res, 'No roles configured');
            }

            if (!allowedRoles.includes(user.role)) {
                return this.responseHttp.FORBIDDEN(res, 'Insufficient permissions');
            }

            next();
        };
    }
}