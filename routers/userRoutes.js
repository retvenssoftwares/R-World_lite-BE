import express from 'express';
const router = express.Router();

import { verifyJwt } from '../middleware/auth.js';

import login from '../controller/admin/login.js';
import getLeadData from '../controller/admin/getLeadData.js'
import getTodayLeads from '../controller/admin/getTodaysLeads.js';
import leadStatus from "../controller/admin/changeLeadStatus.js"
import addToFav from '../controller/admin/addToFav.js';

router.post('/login', login);
router.get('/getLeadData', getLeadData);
router.get('/getTodayLeads', verifyJwt, getTodayLeads);
router.post('/leadStatus', verifyJwt, leadStatus);
router.post('/addToFav', verifyJwt, addToFav);

export default router;