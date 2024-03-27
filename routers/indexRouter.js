import express from 'express';
const app = express.Router();

import userRoutes from './userRoutes.js';
import dashboardRoute from './dashboardRoute.js'

app.use('/api/userRoutes', userRoutes);
app.use('/api/dashboardRoute', dashboardRoute);

export default app;