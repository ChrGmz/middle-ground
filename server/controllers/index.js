const { getVenuesByMidPointOnRoute } = require('../services/google-api-service');
const validator = require('validator');
const { sendVerificationCode, validateVerificationCode } = require('../services/twilio-api-service');
const { MeetUp, User } = require('../models');
const { v4: uuid } = require('uuid');
const { getUserByPhoneNumber } = require('../models/crud');
const { sign } = require('jsonwebtoken');

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
    if (!user || !user.get('conversationHistory').some(conversation => conversation.id !== conversationId)) return res.status(400).json({error: 'Invalid information submitted!'});
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
    res.status(403).json({
      error: 'Bad request: Verification submitted is invalid.',
      status: 403,
    });
  }
  try {
    const response = await validateVerificationCode(phoneNumber, verificationCode);
    // @ts-ignore
    if (response.error) return res.status(500).json({ error: response.error });
    if (!response) return res.status(403).json({ error: 'Authentication failed', status: 403 });
    next();
  } catch (err) {
    console.log(err);
    return { error: err }
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
  } catch {

  }
}

exports.authorizeUser = async (req, res, next) => {
  const {
    cid,
    pid,
    secret,
  } = req.user;

  req.token = sign({
    pid,
  }, secret, { expiresIn: process.env.TOKEN_TTL });
  next();
};

exports.getConversations = async (req, res) => {
  const {
    cid,
    pid,
    secret,
  } = req.user;
};
