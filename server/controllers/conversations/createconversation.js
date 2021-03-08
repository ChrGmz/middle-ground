const { escape, isMobilePhone, isMobilePhoneLocales: locales } = require('validator').default;
const { getUser, createConversation, createMessage } = require('../../models/crud');

module.exports = async (req, res, next) => {
  const { pid } = req.user;
  const { contactPhoneNumber, messageContent } = req.body;
  const sanitizedMessage = escape(messageContent.trim());
  if (!contactPhoneNumber || !sanitizedMessage || !isMobilePhone(contactPhoneNumber, locales, {strictMode: true}) || sanitizedMessage.length > 20000) {
    return res.status(400).json({ 
      error: 'Bad Request. Please make sure all required parameters have been sent in proper format. Messages can be no longer than 20000 characters!',
      status: 400
    });
  }
  try {
    const participant = await getUser({ phoneNumber: contactPhoneNumber });
    const user = await getUser({ _id: pid });
    console.log(participant);
    if (!participant) return res.status(400).json({
      status: 400,
      error: 'Bad request: Contact phone number not listed. Would you like to invite them to the app?',
      submission: {
        contactPhoneNumber,
        message: sanitizedMessage,
      }
    });
    const conversation = await createConversation({
      user_id: pid,
      // @ts-ignore
      participant_id: participant._id,
      message: sanitizedMessage,
      // @ts-ignore
      participantDisplayName: participant.displayName,
    });
    // @ts-ignore
    if (!conversation) throw 'DB error!';
    const message = await createMessage({
      user_id: pid,
      // @ts-ignore
      recipient_id: participant._id,
      text: sanitizedMessage,
    });
    await createConversation({
      // @ts-ignore
      user_id: participant._id,
      participant_id: pid,
      // @ts-ignore
      participantDisplayName: user.displayName,
      message: sanitizedMessage,
    });
    req.payload = {
      conversation,
      message,
    }
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err,
      status: 500,
    })
  }
};