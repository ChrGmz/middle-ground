const Conversation = require('./Conversation');
const Message = require('./Message');
const MeetUp = require('./MeetUp');
const Client = require('./Client');
const User = require('./User');

console.log(Conversation, Message, MeetUp, Client, User);

User.hasMany(Client, {
  foreignKey: 'user_id',
  as: 'clients',
});

User.hasMany(Conversation, {
    foreignKey: 'user_id',
    as: 'conversations',
});

User.hasMany(Message, {
  foreignKey: 'user_id',
  as: 'messages'
});

User.hasMany(MeetUp, {
    foreignKey: 'user_id',
    as: 'meetups'
});

Client.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'clients',
});

MeetUp.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'meetups'
});

Message.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'messages'
});

Conversation.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'conversations'
});

module.exports = {
  Conversation,
  Client,
  User,
  Message,
  MeetUp,
};