const { Op } = require('sequelize');
const { Message } = require("../../types");

module.exports = async (pid) => {
  try {
    const messages = await Message.findAll({
      raw: true,
      where: {
        [Op.or]: [
          { recipient_id: pid },
          { user_id: pid }
        ]
      }
    });
    return messages;
  } catch (err) {
    console.error(err);
    return {error: err};
  }
};