
app.controller('loginCtrl', function($scope, $firebaseObject, $state, $http) {
  $scope.$on('event:social-sign-in-success', function(event, userDetails){
    console.log(userDetails);
    $state.go('profile');
  })
  var ref = firebase.database().ref('users');

  $scope.fbLogin = function() {
    console.log("logging in...");
    var provider = new firebase.auth.FacebookAuthProvider();

    //Asking for user's permissions
    provider.addScope('user_birthday, user_friends');

    //Login into Facebook successfully
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      //Display user's profile
      var user = result.user;
      console.log(user);



      //Making a HTTP request
      $http({
        method: 'GET',
        url: '/v2.10/me?fields=id,name'
      }).then(function successCallback(response) {
        console.log(response);
    }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });




  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
  });
  }


});
