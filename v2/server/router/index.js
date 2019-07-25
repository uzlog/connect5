const express = require('express');
const loginController = require('./../controllers/login');
const addSessionController = require('./../controllers/addSession');
const ParticipantLoginController = require('./../controllers/participantLogin');
const usersRouter = require('./users');
const getParticipantBehavioralInsight = require('./../controllers/behavioralInsight/getParticipantBehavioralInsight');
const getSessionBehavioralInsight = require('./../controllers/behavioralInsight/getSessionBehavioralInsight');
const getTrainerBehavioralInsight = require('./../controllers/behavioralInsight/getTrainerBehavioralInsight');
const getFeedback = require('../controllers/feedback/getFeedback');
const logoutController = require('../controllers/logout');

const surveyQs = require('../controllers/survey/getSurveyQs');
const storeSurvey = require('../controllers/survey/storeSurvey');
const getSurveyResponses = require('../controllers/survey/getSurveyResponses');
const getSessionDetails = require('../controllers/sessionDetails/getSessionDetails');
const getSessionByShortId = require('../controllers/sessionDetails/getSessionByShortId');
const deleteSession = require('../controllers/sessionDetails/deleteSession');
const editSession = require('../controllers/sessionDetails/editSession');
const updateEmails = require('../controllers/sessionDetails/updateEmails.js');

const sendSurveyByEmail = require('../controllers/survey/emailSurvey');

const authentication = require('./../middlewares/authentication');

const feedbackFromParticipant = require('./../controllers/feedback/feedbackFromParticipant');
const getParticipantSessions = require('../controllers/users/getParticipantSessions');
const generateCertificate = require('../controllers/users/generateCertificate');
const checkPINResponsesOnSurvey = require('../controllers/survey/checkPINResponsesOnSurvey');
const confirmEmailRegistration = require('../controllers/sessionDetails/confirmEmailRegistration');

const getCSVData = require('../controllers/feedback/exportCSVData');

const router = express.Router();

router.post('/participant-login', ParticipantLoginController);
router.get('/participant/:id/progress', getParticipantSessions);
router.post('/certificate/:sessionId', generateCertificate);
router.post('/login', loginController);
router.get('/logout', logoutController);
router.post('/add-session', authentication(), addSessionController);

router.get(
  '/behavioral-insight/participant/:PIN',
  getParticipantBehavioralInsight
);

// Route = "/session?shortId=:shortId"
router.get('/sessions', getSessionByShortId);

router.patch('/sessions/:sessionId/confirm-email', confirmEmailRegistration);
router.get('/session-details/:id', getSessionDetails);
router.delete('/session-delete/:id', deleteSession);
router.patch('/session-edit/:id', editSession);
router.patch('/emails-update/:id', updateEmails);
router.get(
  '/behavioral-insight/survey/:sessionId/:surveyType',
  getSessionBehavioralInsight
);
router.get('/behavioral-insight/trainer/:id', getTrainerBehavioralInsight);

router.post('/feedback/', getFeedback);

router.get('/feedback/participant/:PIN', feedbackFromParticipant);

router.use(usersRouter);

router.get('/survey/:id', surveyQs);
router.get('/survey/:surveyType&:shortId/:PIN', checkPINResponsesOnSurvey);

router.get('/session/:sessionId/:surveyType/responses', getSurveyResponses);

router.post('/survey/submit', storeSurvey);

router.post('/survey/email', sendSurveyByEmail);

router.post('/export-csv', authentication(), getCSVData);

module.exports = router;
