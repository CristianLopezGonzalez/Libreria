import bcript from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import {config} from '../config/env';

export class AuthUtils {

    constructor() {
        this.hashPassword = this.hashPassword.bind(this);
        this.comparePassword = this.comparePassword.bind(this);
        this.generateToken = this.generateToken.bind(this);
        this.verifyToken = this.verifyToken.bind(this);
        this.generateRefreshToken = this.generateRefreshToken.bind(this);
        this.verifyRefreshToken = this.verifyRefreshToken.bind(this);
        this.hashToken = this.hashToken.bind(this);
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return await bcript.hash(password, saltRounds);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcript.compare(password, hash);
    }

    async generateToken(payload: object): Promise<string> {
        const secretKey = config.JWT_SECRET;
        return jwt.sign(payload, secretKey, { expiresIn: '3h' });
    }

    async generateRefreshToken(payload: object): Promise<string> {
        const secretKey = config.REFRESH_TOKEN_SECRET;
        return jwt.sign(payload, secretKey, { expiresIn: '7d' });
    }

    async verifyToken(token: string): Promise<any> {
        const secretKey = config.JWT_SECRET;
        return jwt.verify(token, secretKey);
    }

    async verifyRefreshToken(token: string): Promise<any> {
        const secretKey = config.REFRESH_TOKEN_SECRET;
        return jwt.verify(token, secretKey);
    }

    hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
}