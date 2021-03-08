const { v4: uuid } = require('uuid');
const { getUser } = require('..');
const { User } = require('../../types');

module.exports = async ({ phoneNumber, displayName }) => {
  const _id = uuid().replace(/-/g, '');
  console.log(_id);
  try {
    const user = User.create({
      _id,
      phoneNumber,
      displayName,
    });
    return user;
  } catch (err) {
    console.error(err);
    return { error: err };
  }
};