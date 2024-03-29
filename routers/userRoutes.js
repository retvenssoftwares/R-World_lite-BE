import express from 'express';
const router = express.Router();

import { verifyJwt } from '../middleware/auth.js';

import login from '../controller/admin/login.js';
import getLeadDataFromFB from '../controller/admin/getLeadDataFromFB.js'
import getTodayLeads from '../controller/admin/getTodaysLeads.js';
import updateLeadStatus from "../controller/admin/changeLeadStatus.js"
import addToFav from '../controller/admin/addToFav.js';
import leadsOverview from '../controller/admin/leadsOverview.js';
import getLeadDetails from '../controller/admin/getLeadDetails.js';
import addNotes from '../controller/admin/addNotes.js';
import getActivity from '../controller/admin/getActivity.js';
import getNotes from '../controller/admin/getNotes.js';
import getTask from '../controller/admin/getTask.js';
import getForm from '../controller/admin/getAllForm.js';
import getTeam from '../controller/admin/getTeam.js';
import updateTaskStatus from '../controller/admin/updateTaskStatus.js';
import assignLead from '../controller/admin/assignLead.js';
import getMeetAndFollowUp from '../controller/admin/getMeetingAndFollowUp.js';
import searchResult from '../controller/admin/searchLead.js';
import addLeads from '../controller/admin/addLead.js';

router.post('/login', login);
router.get('/getLeadDataFromFB', getLeadDataFromFB);
router.get('/getTodayLeads', verifyJwt, getTodayLeads);
router.patch('/changeLeadStatus', verifyJwt, updateLeadStatus);
router.post('/addToFav', verifyJwt, addToFav);
router.get('/leadsOverview', verifyJwt, leadsOverview);
router.get('/getLeadDetails', verifyJwt, getLeadDetails);
router.post('/addNotes', verifyJwt, addNotes);
router.get('/getActivity', verifyJwt, getActivity);
router.get('/getNotes', verifyJwt, getNotes);
router.get('/getTask', verifyJwt, getTask);
router.get('/getForm', verifyJwt, getForm);
router.get('/getTeam', verifyJwt, getTeam);
router.post('/updateTaskStatus', verifyJwt, updateTaskStatus);
router.post('/assignLead', verifyJwt, assignLead);
router.get('/getMeetAndFollowUp', verifyJwt, getMeetAndFollowUp);
router.get('/searchResult', verifyJwt, searchResult);
router.post('/addLeads', verifyJwt, addLeads);

export default router;