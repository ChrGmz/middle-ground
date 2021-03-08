const { Client } = require("../../")

module.exports = async (searchObject) => {
  try {
    const client = await Client.findOne({ where: searchObject });
    return client;
  } catch (err) {
    console.error(err);
    return {error: 'DB error!'};
  }
};