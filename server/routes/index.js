const { Router } = require('express');
const { requestVenues, logInUser, verifyUser, requestMeetUp, authorizeUser, checkUser } = require('../controllers');
const { checkAuth } = require('../middleware/auth');

const router = Router();

router.post('/confirm', requestVenues);
router.post('/request', requestMeetUp);
router.post('/login', logInUser);
router.post('/verify', verifyUser, checkUser);
router.get('/messages', checkAuth, authorizeUser, getMessages)
router.post('/messages', checkAuth, authorizeUser, )

module.exports = router;
