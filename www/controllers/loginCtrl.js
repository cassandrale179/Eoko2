app.controller('loginCtrl', function($scope, $cordovaOauth, $firebaseAuth, $state, $http) {
  var fbAppId = '694354544087073';
  $scope.authObj = $firebaseAuth();

  $scope.authObj.$onAuthStateChanged(function(firebaseUser){
    if (firebaseUser){
      console.log("Signed in as: " + firebaseUser.uid);
      $scope.getUserInfo(firebaseUser.uid);
    }
    else {
      console.log("Signed out");
    }
  })
  $scope.login = function() {
    var uid;

    //Cordova OAuth Facebook Login
    $cordovaOauth.facebook(fbAppId,["email", "user_birthday", "user_friends"]).then(function(result){
      console.log("User is logged in: " + result.access_token);

      // Facebook authentication with credential
      var credential = firebase.auth.FacebookAuthProvider.credential(
        result.access_token
      );

      $scope.authObj.$signInWithCredential(credential).then(function(firebaseUser) {
        console.log("Credential signed in as:", firebaseUser.uid);
        uid = firebaseUser.uid;

      }).catch(function(error) {
        console.error("Authentication failed:", error);
      });
      $scope.getUserInfo(uid);
      $state.go('actionCreate');
    })
  }

  var ref = firebase.database().ref('users');
  var userInfo;


//Not using this anymore
  $scope.fbLogin = function() {
    console.log("logging in...");
    var provider = new firebase.auth.FacebookAuthProvider();
    //Permissions
    provider.addScope('user_birthday, user_friends');

    firebase.auth().signInWithPopup(provider).then(function(result) {
      console.log("Log in successful!");
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      console.log('User token' + token);

      // The signed-in user info.
      var user = result.user;
      console.log(user);
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
          $state.go('actionCreate');
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

  $scope.getUserInfo = function(uid) {
    var ref = firebase.database().ref('users/' + uid);
    FB.api('/me?fields=birthday, gender, id, name, picture', function(res){
      if(!res || res.error){
        console.log('Error occured while fetching user details.');
      }else{
        userInfo.birthday = res.birthday;
        userInfo.gender = res.gender;
        userInfo.fbid = res.id;
        userInfo = {
          birthday: res.birthday,
          gender: res.gender,
          fbid: res.id,
          name: res.name,
          email: res.email,
          photoURL: res.picture.data.url
        }

      }
      ref.update(userInfo);

    });


    //GET FRIEND LIST (EVEN IF THEY DO NOT USE THE APP )
    FB.api('/me/taggable_friends?limit=5000', function(res){
      if(!res || res.error){
        console.log('Error occured while fetching user friends who are not on the app.');
        console.log(res.error.text);
      }
      else{
        console.log(res);
        var ref = firebase.database().ref("friends/"+user.uid);
        ref.update(res);
      }
    });


    //GET FRIEND LIST (ONLY THE ONE THAT HAD USED THE APP )
    FB.api('/me/friends?limit=5000', function(res){
      if(!res || res.error){
        console.log('Error occured while fetching user friends who use the app.');
      }
      else{
        console.log(res);
        var ref = firebase.database().ref("users/"+user.uid+"/friendsinapp");
        ref.update(res);
      }
    });

      console.log(userInfo);
  }
});
