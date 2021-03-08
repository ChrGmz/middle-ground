const { db, DataTypes } = require('../db');

module.exports = db.define('clients', {
  _id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  secret: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});