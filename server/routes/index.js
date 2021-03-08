const { Router } = require('express');
const { checkToken } = require('../middleware/checktoken');
const { postMessage, registerUser, loginUser, verifyUser, authorizeUser, getMessages, reauthorizeUser, getConversations, createConversation } = require('../controllers');
// const { refreshToken } = require('../middleware/refreshtoken');
const router = Router();

console.log(getMessages);
// router.post('/cancel', checkToken, cancelMeetUp, reauthorizeUser);
// router.post('/confirm', checkToken, updateMeetUp, reauthorizeUser);
// router.post('/request', checkToken, requestMeetUp, reauthorizeUser);
router.post('/login', loginUser);
// router.post('/logout', checkToken, logoutUser);
router.post('/verify', verifyUser, authorizeUser); 
router.get('/messages', checkToken, getMessages, reauthorizeUser);
router.post('/messages', checkToken, postMessage, reauthorizeUser);
router.get('/conversations', checkToken, getConversations, reauthorizeUser);
router.post('/conversations', checkToken, createConversation, reauthorizeUser);
router.post('/register', registerUser )


module.exports = router;
