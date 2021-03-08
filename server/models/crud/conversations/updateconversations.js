const { Conversation } = require("../../types");
const { Op } = require('sequelize');

module.exports = async ({message, user_id, participant_id}) => {
  const conversations = await Conversation.update({
    lastMessage: message,
  }, {
    returning: true,
    where: {
      [Op.or]: [
        // @ts-ignore
        { [Op.and]: [{user_id}, {participant_id}] },
        // @ts-ignore
        { [Op.and]: [{user_id: participant_id}, {participant_id: user_id}] },
      ]
    },
  });
  console.log(conversations);
  return conversations;
}