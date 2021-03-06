const { Router } = require('express');
const { requestVenues, logInUser, verifyUser, requestMeetUp, checkUser, getMessages, refreshToken, logOutUser } = require('../controllers');
const { checkToken } = require('../middleware/auth');

const router = Router();

router.post('/confirm', requestVenues);
router.post('/request', requestMeetUp);
router.post('/login', logInUser);
router.post('/logout', checkToken, logOutUser);
router.post('/verify', verifyUser, checkUser);
router.get('/messages', checkToken, getMessages, refreshToken);
router.post('/messages', checkToken, postMessage, refreshToken);


module.exports = router;
