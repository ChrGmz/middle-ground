const { isMobilePhoneLocales: locales, isMobilePhone} = require('validator').default;
const { validateVerificationCode } = require('../../services/twilio-api-service');
const { getUser } = require('../../models/crud');

module.exports = async (req, res, next) => {
  const { verificationCode, phoneNumber } = req.body;
  if (!verificationCode || !(/^\d{6}$/.test(verificationCode)) || !phoneNumber || !isMobilePhone(phoneNumber, locales, {strictMode: true})) {
    return res.status(404).json({
      error: 'Bad request: Verification information submitted is invalid.',
      status: 404,
      validation: {
        verificationCode,
        'code test': /^\d{6}$/.test(verificationCode),
        phoneNumber,
        'mobile phone test': isMobilePhone(phoneNumber, locales, {strictMode: true}),
      }
    });
  }
  try {
    const user = await getUser({ phoneNumber });
    if (!user) return res.status(400).json({error: 'No user found with that number. Please check the paramaters that were sent!'});
    const verified = await validateVerificationCode(phoneNumber, verificationCode);
    if (!verified) return res.status(403).json({ error: 'Authentication failed', status: 403 });
    // @ts-ignore
    if (verified.error) return res.status(500).json({ error: verified.error });
    req.user = {
      // @ts-ignore
      pid: user._id,
    };
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};