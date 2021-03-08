const { db, DataTypes } = require('../db');

module.exports = db.define('meetups', {
  _id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  recipient_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  origin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destination: {
    type: DataTypes.STRING,
  },
  midPoint: {
    type:DataTypes.STRING,
  },
  venueType: {
    type: DataTypes.STRING,
  },
  venues: {
    type: DataTypes.JSON,
  },
  selectedVenue: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  cancellationReason: {
    type: DataTypes.STRING,
  },
});