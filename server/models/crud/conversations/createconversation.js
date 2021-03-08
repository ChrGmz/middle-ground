const { v4: uuid } = require('uuid');
const Conversation = require('../../types/Conversation');

module.exports = async ({user_id, participant_id, participantDisplayName, message}) => {
  const _id = uuid().replace(/-/g, '');
  try {
    const conversation = await Conversation.create({
      _id,
      user_id,
      participant_id,
      participantDisplayName,
      lastMessage: message,
    });
    if (conversation) return conversation;
    return {error: 'DB error!'};
  } catch (err) {
    console.error(err);
    return { error: err };
  }
};