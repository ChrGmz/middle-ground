const { db, DataTypes } = require('../db');

module.exports = db.define('conversations', {
  _id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  participant_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  viewed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  newCount: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  lastMessage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  participantDisplayName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});