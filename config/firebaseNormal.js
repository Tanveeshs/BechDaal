//jshint esversion:6

const firebase = require('firebase');
const config = {
  apiKey: "AIzaSyBLuew7KtUavf5rzwJlykBEwzyTCJjGj7k",
  authDomain: "chatapp-ced19.firebaseapp.com",
  databaseURL: "https://chatapp-ced19.firebaseio.com",
  projectId: "chatapp-ced19",
  storageBucket: "chatapp-ced19.appspot.com",
  messagingSenderId: "361216818821",
  appId: "1:361216818821:web:681e0804b690632d9fb3ec",
  measurementId: "G-1S1GTY3CGP"
};
firebase.initializeApp(config);
firebase.firestore().settings({
  timestampsInSnapshots: true
});

module.exports = {
  myFirebase: firebase,
  myFirestore: firebase.firestore(),
  myStorage: firebase.storage
};
