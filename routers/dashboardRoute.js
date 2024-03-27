import express from 'express';
const router = express.Router();

import { verifyJwt } from '../middleware/auth.js';


import getMonthReport from '../controller/dashboard/report.js';


router.get('/getMonthReport', verifyJwt, getMonthReport);


export default router;