import express from 'express';
const router = express.Router();

import { verifyJwt } from '../middleware/auth.js';

import login from '../controller/login.js';
import getLead from '../controller/getLeadData.js'

router.post('/login', login);
router.get('/getLead', getLead);

export default router;