const { escape, isMobilePhone, isMobilePhoneLocales: locales } = require('validator').default;
const { getUser, createUser } = require('../../models/crud');

module.exports = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const displayName = escape(req.body.displayName.trim());
  if (displayName.length < 1) return res.status(400).json({ error: 'Bad Request. Name should at least be one character long.', status: 400 });
  if (displayName.length > 53) return res.status(400).json({ error: 'Bad Request. Name is too long', status: 400 });
  if (!phoneNumber || !displayName || !isMobilePhone(phoneNumber, locales, {strictMode: true})) return res.status(400).json({ status: 400, error: 'Bad Request: Please check that appropriate parameters have been submitted.', validationResults: {
    phoneNumber,
    displayName,
    numberValidation: isMobilePhone(phoneNumber),
  }});
  console.log(isMobilePhone(phoneNumber));
  try {
    let previousUser = await getUser({ phoneNumber });
    // @ts-ignore
    if (previousUser) return res.status(400).json({
      status: 400,
      // @ts-ignore
      error: previousUser.error ? previousUser.error : 'Previous registration'
    });
    const user = await createUser({ phoneNumber, displayName });
    if (user) return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, error: err});
  }
};