import express from 'express';
import cors from 'cors';
import { config } from './config/env';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Api online' });
})

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
})