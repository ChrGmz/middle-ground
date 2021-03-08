const getMessagesFromDb = require('../../models/crud/messages/getmessages');

module.exports = async (req, res, next) => {
  const {
    pid
  } = req.user;
  try {
    const messages = await getMessagesFromDb(pid);
    // @ts-ignore
    if (messages.error) res.status(500).json({ error: 'DB error', status: 500 });
    req.payload = { messages };
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, error: err });
  }
};