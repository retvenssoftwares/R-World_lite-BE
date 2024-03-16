import express from 'express';
const app = express.Router();

import userRoutes from './userRoutes.js';

app.use('/api/userRoutes', userRoutes);

export default app;