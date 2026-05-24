import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { config } from './config/env';

import authRoutes from './routes/AuthRoutes';
import authorRoutes from './routes/AuthorRoutes';
import categoryRoutes from './routes/CategoryRoutes';
import editorialRoutes from './routes/EditorialRoutes';
import bookRoutes from './routes/BookRoutes';
import userRoutes from './routes/UserRoutes';

const app = express();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 429, message: 'Too many requests, please try again later.' },
});

app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/editorials', editorialRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Api online' });
})



app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
})