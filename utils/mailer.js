//jshint esversion:6

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'bechdaal1@gmail.com',
    pass: 'oherodyprkvomjwo'
  }
});
module.exports = function(email, content) {
  let mail = {
    from: 'indentinternship@gmail.com',
    to: email,
    subject: 'Test Mail',
    text: content
  };
  transporter.sendMail(mail, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
      console.log('Mail sent successfully');
    }

  });

};
