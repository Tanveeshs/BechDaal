//jshint esversion:6

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'bechdaal1@gmail.com',
    pass: 'oherodyprkvomjwo'
  }
});
module.exports = function(email,subject,content) {
  let mail = {
    from: 'bechdaal1@gmail.com',
    to: email,
    subject:subject,
    html: content
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
