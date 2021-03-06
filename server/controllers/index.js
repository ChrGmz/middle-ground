// @ts-nocheck
const { getVenuesByMidPointOnRoute } = require('../services/google-api-service');
const validator = require('validator');
const { sendVerificationCode, validateVerificationCode } = require('../services/twilio-api-service');
const { MeetUp, User } = require('../models');
const { v4: uuid } = require('uuid');
const { getUserByPhoneNumber, getMessagesFromDb } = require('../models/crud');
const { sign } = require('jsonwebtoken');

const createToken = async (pid, secret) => sign({
  pid,
  }, secret, { expiresIn: process.env.TOKEN_TTL });

// need to refactor this code to pull out CRUD operations to the models folder

exports.requestVenues = async (req, res) => {
  const { location: destination, meetupid: meetUpId } = req.body;
  if (!destination || !meetUpId) return res.status(400).json({ 
    error: 'Bad request: Incomplete Request'
  });
  try {
    const meetUp = await MeetUp.findOne({ id: meetUpId });
    if (!meetUp) return res.status(400).json({ status: 400, error: 'Bad request: Please send with correct paramaters!' });
    const origin = meetUp.get('origin');
    const venues = await getVenuesByMidPointOnRoute(origin, destination);
    return res.status(200).json(venues);
  } catch (err) {
    console.error(err);
    return { error: err };
  }
};

exports.requestMeetUp = async (req, res) => {
  const { userId, location: origin, conversationId, venueType } = req.body;
  if (!origin || !conversationId || !venueType) return res.status(400).json({ status: 400, error: 'Bad request: Please send with correct paramaters!' });
  try {
    const user = await User.findOne({ id: userId });
    const conversationHistory = await user.get('conversationHistory');
    if (!conversationHistory?.length) return res.status(400).json({status: 400, error: 'Invalid parameters were submitted!'});
    const conversation = conversationHistory.find(conversation => conversation.id !== conversationId);
    if (!user || !conversation) return res.status(400).json({error: 'Invalid information submitted!'});
    const meetUp = await MeetUp.create({
      id: uuid().replace(/-/g, ''),
      users: [user.get('pid')],
      venueType,
    });
    if (meetUp) res.status(200).json({ status: 200, meetUp });
    return res.status(500).json({ status: 500, error: 'Database error!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err, status: 500 });
  }
};

exports.verifyUser = async (req, res, next) => {
  const { verificationCode } = req.body;
  const phoneNumber = req.body.phoneNumber?.replace(/\D/, '');
  if (!verificationCode || !validator.default.matches(verificationCode, /^\d{6}$/) || !phoneNumber || !validator.default.isMobilePhone(phoneNumber)) {
    res.status(404).json({
      error: 'Bad request: Verification information submitted is invalid.',
      status: 404,
    });
  }
  try {
    const verified = await validateVerificationCode(phoneNumber, verificationCode);
    if (verified.error) return res.status(500).json({ error: response.error });
    if (!verified) return res.status(403).json({ error: 'Authentication failed', status: 403 });
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

exports.logInUser = async (req, res) => {
  const phoneNumber = req.body.phoneNumber?.replace(/\D/, '');
  if (!phoneNumber || !validator.default.isMobilePhone(phoneNumber)) {
    res.status(403).json({
      error: `Bad request: Phone Number provided, ${phoneNumber} is not a valid mobile number.`,
      status: 403,
    });
  }
  try {
    const response = await sendVerificationCode(phoneNumber);
    if (response.status !== 'pending') {
      res.status(500).json({
      error: 'Possible Server Error. Please check the number and try again!',
      status: 500,
      });
    }
    res.status(200).json({
      success: true,
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err,
      status: 500,
    });
  }
};

exports.checkUser = async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const user = await getUserByPhoneNumber(phoneNumber);
    // @ts-ignore
    if (user.error) return res.status(500).json({ status: 500, error: user.error});
    const cid = uuid().replace(/-/g, '');
    const secret = uuid().replace(/-/g, '');
    const req.token = createToken(user.pid, secret);
  } catch {

  }
};

exports.refreshToken = async (req, res) => {
  const {
    cid,
    pid,
    secret,
  } = req.user;

  const token = sign({
    pid,
  }, secret, { expiresIn: process.env.TOKEN_TTL });
  
  res.status(200).json({
    token,
    ...req.payload,
  });
};

exports.getMessages = async (req, res, next) => {
  const {
    pid
  } = req.user;
  try {
    const messages = await getMessagesFromDb(pid);
    if (messages.error) res.status(500).json({ error: 'DB error', status: 500 });
    req.payload = { messages };
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, error: err });
  }
};

exports.logOutUser = async (req, res) => {
  const { cid } = req.user;
  try {
    const response = await deleteClient(cid);
    if (!response.success) return res.status(500).json({ status: 500, error: response.error });
    return res.status(200).json({ status: 200, success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, error: err });
  }
};

exports.postMessage = async (req, res) => {
  const { pid, contactId, message } = req.body;
};