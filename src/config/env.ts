import dotenv from 'dotenv';

dotenv.config();

if (!process.env.PORT || !process.env.DATABASE_URL || !process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    throw new Error('Missing required environment variables');
}

export const config = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    FRONTEND_URL: process.env.FRONTEND_URL
}