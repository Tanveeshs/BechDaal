//jshint esversion:6

const nodemailer = require('nodemailer');
// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: 'bechdaal1@gmail.com',
//     pass: 'oherodyprkvomjwo'
//   }
// });
const transporter = nodemailer.createTransport({
  host: "smtp.bechdaal.tech",
  port: 587,
  secure: false,
  auth:{
    user:process.env.email,
    pass:process.env.pass
  },
  tls: {
    rejectUnauthorized: false
  }

})

module.exports = function(email,subject,content) {
  let mail = {
    from: 'admin@bechdaal.tech',
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
