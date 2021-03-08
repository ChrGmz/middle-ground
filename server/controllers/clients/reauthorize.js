const { createToken } = require('../../middleware/createtoken');

module.exports = async (req, res) => {
  const { cid, pid, secret } = req.user;
  console.log('I\'m here!');
  try {
    const token = await createToken(pid, secret);
    return res.status(200).json({
      ...req.payload,
      status: 200,
      cid,
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, error: err });
  }
};