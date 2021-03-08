const { Sequelize, DataTypes } = require('sequelize');

const db = new Sequelize(process.env.DB_CONNECTION_URI);
(async () => {
  db.sync();
  console.log('Connected to DB!');
})();

exports.db = db;
exports.DataTypes = DataTypes;