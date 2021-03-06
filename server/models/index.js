// will need to use sequelize to use a psql db as nonrelational db is not ideal for
// users with multiple sessions, multiple conversations with different users

const mongoose = require('mongoose');

const DB_CONNECTION_URI =
  process.env.DB_CONNECTION_URI ||
  'mongodb://localhost:27017/middle-ground-app';

(async () => {
  mongoose.connect(DB_CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
})();

mongoose.connection.on('connected', () => {
  console.log(`Connected to DB at ${DB_CONNECTION_URI}`);
});

mongoose.connection.on('error', () => {
  console.log('DB error!');
})

const userSchema = new mongoose.Schema({
  pid: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  conversationHistory: {
    type: Array,
    required: true,
  }
});

const clientSchema = new mongoose.Schema({
  pid: {
    type: String,
    required: true,
  },
  cid: {
    type: String,
    required: true,
  },
  secret: {
    type: String,
    required: true,
  },
});

const meetUpSchema = new mongoose.Schema({
  id: String,
  origin: {
    type: String,
    required: true,
  },
  venueType: {
    type: String,
    required: true,
  },
  users: {
    type: String,
    required: true,
  }
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Client: mongoose.model('Client', clientSchema),
  MeetUp: mongoose.model('MeetUp', meetUpSchema),
};
