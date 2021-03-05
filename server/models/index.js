const mongoose = require('mongoose');
const DB_CONNECTION_URI = process.env.DB_CONNECTION_URI || 'mongodb://localhost:27017/middle-ground-app';

(async() => {
  mongoose.connect(DB_CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
})();

mongoose.connection.on('connected', () => {
  console.log(`Connected to DB at ${DB_CONNECTION_URI}`);
});

const userSchema = new mongoose.Schema({
  pid: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  }

});