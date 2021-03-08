const jwt = require('jsonwebtoken');
const getClient = require('../models/crud/clients/getclient');


const verify = (token, secret) => new Promise((resolve, reject) => {
  jwt.verify(token, secret, (err, data) => {
    if (err) reject(err);
    resolve(data);
  });
});

exports.checkToken = async (req, res, next) => {
  const { headers } = req;
  const cid = headers['x-client-id'] || req.query.cid;
  const [, token] = (headers.authorization || '').split(/\s+/);
  if (!token || !cid) return res.status(401).json({ error: 'Not authorized', status: 401 });
  try {
    const client = await getClient({ _id: cid });
  // @ts-ignore
  if (!client || client.error) res.status(401).json({ status: 401, error: 'Bad request: not authorized!'});
    // @ts-ignore
    const secret = client.secret;
    const { pid } = await verify(token, secret);
    req.user = {
      cid,
      pid,
      secret,
    };
    next();
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error', status: 500 });
  }
};

