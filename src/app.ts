import express from 'express';
import cors from 'cors';
import { config } from './config/env';

import authRoutes from './routes/AuthRoutes';
import authorRoutes from './routes/AuthorRoutes';
import categoryRoutes from './routes/CategoryRoutes';
import editorialRoutes from './routes/EditorialRoutes';
import bookRoutes from './routes/BookRoutes';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/editorials', editorialRoutes);
app.use('/api/books', bookRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Api online' });
})



app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
})