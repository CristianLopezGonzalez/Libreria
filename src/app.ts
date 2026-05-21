import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import authRoutes from './routes/AuthRoutes';


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Api online' });
})

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
})