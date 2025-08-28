import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import artistRoutes from './routes/artistRoutes.js'
import albumRoutes from './routes/albumRoutes.js';

const api = express();
const PORT = process.env.PORT || 3000;

api.use(cors());
api.use(express.json());
api.use('/users', userRoutes);
api.use('/artists', artistRoutes);
api.use('/albums', albumRoutes);

api.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});