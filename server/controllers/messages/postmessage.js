const { isMobilePhone, isMobilePhoneLocales: locales } = require('validator').default;
const { getUser, createMessage, getConversations, updateConversations } = require('../../models/crud/index');

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
    if (!participant) return res.status(400).json({
      status: 400,
      error: 'Bad request: Contact phone number not listed. Would you like to invite them to the app?',
      submission: {
        contactPhoneNumber,
        message: sanitizedMessage,
      }
    });
    const message = await createMessage({
      user_id: pid,
      // @ts-ignore
      recipient_id: participant._id,
      text: sanitizedMessage,
    });
    const conversations = await updateConversations({
      message: sanitizedMessage,
      user_id: pid,
      // @ts-ignore
      participant_id: participant._id,
    });
    req.payload = {
      message,
      conversations,
    };
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err,
      status: 500,
    })
  }
};