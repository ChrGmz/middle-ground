const { sign } = require('jsonwebtoken');
const { v4: uuid } = require('uuid');

exports.createToken = (pid, secret) => {
  const token = sign({
    pid,
    }, secret, { expiresIn: process.env.TOKEN_TTL });
  return token;
}