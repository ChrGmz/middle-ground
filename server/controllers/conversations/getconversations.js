const getConversationsFromDb = require('../../models/crud/conversations/getconversations');

module.exports = async (req, res, next) => {
  const {
    pid
  } = req.user;
  try {
    const conversations = await getConversationsFromDb({user_id: pid});
    // @ts-ignore
    if (conversations.error) res.status(500).json({ error: 'DB error', status: 500 });
    req.payload = { conversations };
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, error: err });
  }
};