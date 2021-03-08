const { sign } = require('jsonwebtoken');

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