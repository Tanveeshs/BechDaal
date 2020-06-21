var admin = require("firebase-admin");

var serviceAccount = require('../chatapp-ced19-firebase-adminsdk-hfa4g-300e5a9f9d.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chatapp-ced19.firebaseio.com"
});
module.exports = admin;
