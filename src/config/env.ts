import dotenv from 'dotenv';

dotenv.config();

if (!process.env.PORT || !process.env.DATABASE_URL || !process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET || !process.env.RESEND_API_KEY || !process.env.RESEND_DOMAIN) {
    throw new Error('Missing required environment variables');
}

export const config = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_DOMAIN: process.env.RESEND_DOMAIN
}