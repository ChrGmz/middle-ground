const { v4: uuid } = require('uuid');
const Client = require('../../types/Client');

module.exports = async (user_id) => {
  const _id = uuid().replace(/-/g, '');
  const secret = uuid().replace(/-/g, '');
  try {
    const client = await Client.create({
      _id,
      user_id,
      secret,
    });
    if (client) return client;
    return {error: 'DB error!'};
  } catch (err) {
    console.error(err);
    return { error: err };
  }
};