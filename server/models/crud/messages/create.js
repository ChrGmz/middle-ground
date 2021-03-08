const { v4: uuid } = require('uuid');
const { Message } = require('../../types');

module.exports = async ({user_id, recipient_id, text }) => {
  const _id = uuid().replace(/-/g, '');
  try {
    const message = await Message.create({
      _id,
      user_id,
      recipient_id,
      text,
    });
    if (message) return Message;
    throw 'DB error!'
  } catch (err) {
    console.error(err);
    return { error: err };
  }
};