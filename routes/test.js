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

router.get('/addfriend/:adName/:id', function(req, res) {
  myFirestore.collection('users')
    .where('id', '==', String(req.user._id))
    .get().
  then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      myFirestore.collection('users').doc(doc.id).update({
        contacts: firebase.firestore.FieldValue.arrayUnion({userID:req.params.id,adName:req.params.adName})
      });
    });
  });
  myFirestore.collection('users')
    .where('id', '==', String(req.params.id))
    .get().
  then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      myFirestore.collection('users').doc(doc.id).update({
        contacts: firebase.firestore.FieldValue.arrayUnion({userID:String(req.user._id),adName:req.params.adName})
      });
    });
  });
  res.redirect('/test/chat');

});

// router.get('/user',function (req,res) {
//     console.log(req)
//     res.send('Hey')
// })

module.exports = router;
