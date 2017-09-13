
app.controller('loginCtrl', function($scope, $firebaseObject, $state, $http) {


  var ref = firebase.database().ref('users');
  var userInfo;

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
    userInfo = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL
    }
    console.log(user);
    console.log(token);
    firebase.auth().onAuthStateChanged(function(user){
      if (user) {
        console.log("user is logged in!");
        $scope.getUserInfo(user);
      }
      else {
        console.log("No user is signed in.");
      }
    })




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

  $scope.getUserInfo = function(user) {
    var ref = firebase.database().ref('users/' + user.uid);
    //Get user infio
    FB.api('/me?fields=birthday, gender', function(res){
      if(!res || res.error){
        console.log('Error occured while fetching user details.');
      }else{
        userInfo.birthday = res.birthday;
        userInfo.gender = res.gender;

      }
      ref.update(userInfo);

    });
    //Get friends list
    FB.api('/me/taggable_friends?limit=5000', function(res){
      if(!res || res.error){
        console.log('Error occured while fetching user details.');
      }
      else{
        console.log(res);
        var ref = firebase.database().ref("friends/"+user.uid);
        ref.update(res);
      }
    })
      console.log(userInfo);
  }


});
