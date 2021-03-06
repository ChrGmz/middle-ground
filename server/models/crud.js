const { Client, User } = require(".");
const { v4: uuid } = require('uuid');

exports.getClient = async (cid) => {
  try {
    const client = await Client.findOne({ cid });
    return client;
  } catch (err) {
    console.error(err);
    return {
      error: 'DB Connection Error!',
    };
  }
};

exports.getUserByPhoneNumber = async (phoneNumber) => {
  try {
    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = await User.create({
        pid: uuid().replace(/-/g, ''),
        phoneNumber,
        conversationHistory: [],
      });
    }
    return user;
  } catch (err) {
    console.error(err);
    return {error: 'DB error!'};
  }
};

exports.createClient = async (pid) => {
  try {
    const client = await Client.create({
      pid,
      cid: uuid().replace(/-/g, ''),
      secret: uuid().replace(/-/g, ''),
    });
    return client;
  } catch (err) {
    console.error(err);
    return { error: err};
  }
};

exports.getMessagesFromDb = async (pid) => {
  try {
    const user = await User.findOne({ pid });
    const messages = user.get('conversationHistory');
    return messages;
  } catch (err) {
    console.error(err);
    return { error: err };
  }
}

exports.deleteClient = async (cid) => {
  try {
    await Client.deleteOne({ cid });
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: err };
  }
};