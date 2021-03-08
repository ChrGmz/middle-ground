const { User } = require("../../")

module.exports = async (searchObject) => {
  try {
    const user = await User.findOne({ 
      raw: true,
      where: searchObject 
    });
    return user;
  } catch (err) {
    console.error(err);
    return {error: 'DB error!'};
  }
};