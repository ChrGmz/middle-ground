const { v4: uuid } = require('uuid');
const { createToken } = require("../../middleware/createtoken");
const createclient = require("../../models/crud/clients/createclient");

module.exports = async (req, res) => {
  const { pid } = req.user;
  try {
    const client = await createclient(pid);
    // @ts-ignore
    if (client.error) res.status(500).json({ status: 500, error: client.error });
    if (client) {
      // @ts-ignore
      const token = await createToken(client.user_id, client.secret);
      return res.status(200).json({
        // @ts-ignore
        cid: client._id,
        pid,
        status: 200,
        token,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, error: err });
  }
};