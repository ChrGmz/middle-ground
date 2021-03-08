const { User, MeetUp } = require("../../models");
const { v4: uuid } = require('uuid');

exports.requestMeetUp = async (req, res) => {
  const { userId, location: origin, conversationId, venueType } = req.body;
  if (!origin || !conversationId || !venueType) return res.status(400).json({ status: 400, error: 'Bad request: Please send with correct paramaters!' });
  try {
    const user = await User.findOne({ id: userId });
    const conversationHistory = await user.get('conversationHistory');
    if (!conversationHistory?.length) return res.status(400).json({status: 400, error: 'Invalid parameters were submitted!'});
    const conversation = conversationHistory.find(conversation => conversation.id !== conversationId);
    if (!user || !conversation) return res.status(400).json({error: 'Invalid information submitted!'});
    const meetUp = await MeetUp.create({
      id: uuid().replace(/-/g, ''),
      users: [user.get('pid')],
      venueType,
    });
    if (meetUp) return res.status(200).json({ status: 200, meetUp });
    return res.status(500).json({ status: 500, error: 'Database error!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err, status: 500 });
  }
};