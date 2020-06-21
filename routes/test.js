//jshint esversion:6

var express = require('express');
var router = express.Router();
const admin = require('../config/firebase');
const {
  User
} = require('../model/user');
const firebase = require('firebase');
const {
  myFirebase,
  myFirestore
} = require('../config/firebaseNormal');

router.get('/chat', function(req, res) {
  admin.auth().createCustomToken(req.user._id.toString())
    .then(r => {
      console.log('http://localhost:3000/user/' + r);
      res.redirect('http://localhost:3000/user/' + r);
    }).catch((err) => console.log(err));
});
router.get('/addfriend/:id', function(req, res) {
  myFirestore.collection('users')
    .where('id', '==', String(req.user._id))
    .get().
  then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      myFirestore.collection('users').doc(doc.id).update({
        contacts: firebase.firestore.FieldValue.arrayUnion(req.params.id)
      });
    });
  });
  myFirestore.collection('users')
    .where('id', '==', String(req.params.id))
    .get().
  then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      myFirestore.collection('users').doc(doc.id).update({
        contacts: firebase.firestore.FieldValue.arrayUnion(String(req.user._id))
      });
    });
  });
  res.redirect('/test/chat');

});
router.get('/getName/:id', function(req, res) {
  const id = req.params.id;
  User.find({
    _id: id
  }, function(err, result) {
    res.send(result[0].local.username);
  });
});

// router.get('/user',function (req,res) {
//     console.log(req)
//     res.send('Hey')
// })

module.exports = router;
