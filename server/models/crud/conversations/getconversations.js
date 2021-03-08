const { Conversation } = require("../../types");

module.exports = async (searchObject) => {
  try {
    const conversations = await Conversation.findAll({ 
      raw: true,
      where: searchObject,
    });
    return conversations;
  } catch (err) {
    console.error(err);
    return {error: err};
  }
};