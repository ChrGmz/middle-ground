const { db, DataTypes } = require('../db');

module.exports = db.define('messages', {
  _id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  recipient_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // options to pursue if there is time
  // file: {
  //   type: DataTypes.STRING,
  //   defaultValue: false,
  // },
  // meta: {
  //   type:DataTypes.STRING,
  // },
  deletedUser_id: {
    type: DataTypes.STRING,
  },
});