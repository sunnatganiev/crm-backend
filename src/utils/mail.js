const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'aryanna.macgyver@ethereal.email',
    pass: 'dQq9AvUNGnQGz9rqtT',
  },
});

const emailProcessor = (user, pin) => {
  const result = {
    from: `"CRM Company 👻" <${process.env.MAIL}>`, // sender address
    to: `${user.name}, ${user.email}`, // list of receivers
  };
  if (pin) {
    result.subject = 'Reset Password'; // Subject line
    result.text = `Here is your password reset pin ${pin}. This pin will expires in 1 day`; // plain text body
    result.html = `<b>Hello </b>
        <b>${user.name}</b>
        <p>This is ${pin} pin to reset your password. This pin will expires in 1 day</p>
        `;
  } else {
    result.subject = 'Password updated successfully'; // Subject line
    result.text = `Your password is updated successfully`; // plain text body
  }

  return result;
};

const sendMail = async (user, pin = undefined) => {
  try {
    const information = emailProcessor(user, pin);
    const result = await transporter.sendMail(information);

    console.log('Message sent: %s', result.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(result));
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = sendMail;
