const { isMobilePhone, isMobilePhoneLocales: locales } = require('validator').default;
const { getUser } = require('../../models/crud');
const { sendVerificationCode } = require('../../services/twilio-api-service');

module.exports = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  if (!phoneNumber || !isMobilePhone(phoneNumber, locales, {strictMode: true})) {
    res.status(403).json({
      error: `Bad request: Phone Number provided, ${phoneNumber} is not a valid mobile number.`,
      status: 403,
    });
  }
  const user = await getUser({ phoneNumber });
  if (!user) return res.status(400).json({status: 400, error: 'Invalid credentials'});
  try {
    const response = await sendVerificationCode(phoneNumber);
    if (response.status !== 'pending') {
      res.status(500).json({
      error: 'Possible Server Error. Please check the number and try again!',
      status: 500,
      });
    }
    res.status(200).json({
      success: true,
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err,
      status: 500,
    });
  }
};