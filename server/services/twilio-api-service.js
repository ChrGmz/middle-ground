const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

exports.sendVerificationCode = async (phoneNumber) => {
  const response = await client
    .verify
    .services(process.env.SERVICE_ID)
    .verifications
    .create({
      to: phoneNumber,
      channel: 'sms',
    });
  return response;
};

exports.validateVerificationCode = async (phoneNumber, verificationCode) => {
  console.log(phoneNumber, verificationCode);
  try {
    const response = await client
      .verify
      .services(process.env.SERVICE_ID)
      .verificationChecks
      .create({
        to: phoneNumber,
        code: verificationCode,
      });
    return response.valid;
  } catch (err) {
    
    console.log(err);
    return {error: err};
  }
}