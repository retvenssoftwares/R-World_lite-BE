import express from 'express';
const router = express.Router();

import { verifyJwt } from '../middleware/auth.js';

import login from '../controller/admin/login.js';
import getLeadDataFromFB from '../controller/admin/getLeadDataFromFB.js'
import getTodayLeads from '../controller/admin/getTodaysLeads.js';
import leadStatus from "../controller/admin/changeLeadStatus.js"
import addToFav from '../controller/admin/addToFav.js';
import leadsOverview from '../controller/admin/leadsOverview.js';
import getLeadDetails from '../controller/admin/getLeadDetails.js';
import addNotes from '../controller/admin/addNotes.js';

router.post('/login', login);
router.get('/getLeadDataFromFB', getLeadDataFromFB);
router.get('/getTodayLeads', verifyJwt, getTodayLeads);
router.patch('/leadStatus', verifyJwt, leadStatus);
router.post('/addToFav', verifyJwt, addToFav);
router.get('/leadsOverview', verifyJwt, leadsOverview);
router.get('/getLeadDetails', verifyJwt, getLeadDetails);
router.get('/addNotes', verifyJwt, addNotes);

export default router;