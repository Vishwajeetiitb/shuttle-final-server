// Set the configuration for your app
// TODO: Replace with your project's config object
var firebase = require('firebase');
var config = {
  apiKey: 'AIzaSyBqO1BcLqLAQt5_dYGOd9WUW_vlztk4tRA',
  authDomain: 'e-shuttle-tracker-base.firebaseapp.com',
  databaseURL: 'https://e-shuttle-tracker-base.firebaseio.com',
  storageBucket: 'bucket.appspot.com'
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();
testRef = database.ref('vishwajeet');
testRef.set({
  display: 'hell'
  //   moment: now.valueOf()
});
