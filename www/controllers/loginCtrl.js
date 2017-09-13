
app.controller('loginCtrl', function($scope, $firebaseObject, $state) {
  $scope.$on('event:social-sign-in-success', function(event, userDetails){
    console.log(userDetails);
    $state.go('profile');
  })
  var ref = firebase.database().ref('users');

  $scope.fbLogin = function() {
    console.log("logging in...");
    var provider = new firebase.auth.FacebookAuthProvider();
    //Permissions
    provider.addScope('user_birthday, user_friends');

    firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var token = result.credential.accessToken;

    // The signed-in user info.
    var user = result.user;
    console.log(user);



    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
  }




});
