angular.module('firebaseConfig', ['firebase'])

.run(function(){

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDXtpBhf59eMrmIaGr42AEo71qFEfTO--I",
    authDomain: "eoko2-2f7a8.firebaseapp.com",
    databaseURL: "https://eoko2-2f7a8.firebaseio.com",
    projectId: "eoko2-2f7a8", 
    storageBucket: "eoko2-2f7a8.appspot.com",
     messagingSenderId: "497960328029" 
  };
  firebase.initializeApp(config);

}) 


