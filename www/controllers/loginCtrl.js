app.controller('loginCtrl', function($scope, $cordovaOauth, $firebaseAuth, $state, $http, ngFB, $window) {
  var fbAppId = '694354544087073';
  $scope.authObj = $firebaseAuth();
  var userInfo;
  var currentUserUid;


  $scope.authObj.$onAuthStateChanged(function(firebaseUser){
    if (firebaseUser){
      console.log("Signed in as: " + firebaseUser.uid);
      currentUserUid = firebaseUser.uid;

      $scope.getUserInfo();
    }
    else {
      console.log("Signed out");
    }
  })

  $scope.login = function() {
    ngFB.login({scope: 'email, user_birthday, user_friends'}).then(
        function (response) {
            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
                console.log("FB access token: ", response.authResponse.accessToken);
                //Facebook authentication with credential
                    var credential = firebase.auth.FacebookAuthProvider.credential(
                      response.authResponse.accessToken
                    );


                    $scope.authObj.$signInWithCredential(credential).then(function(firebaseUser) {
                      console.log("Credential signed in as:", firebaseUser.uid);
                      currentUserUid = firebaseUser.uid;
                      $scope.getUserInfo();

                    }).catch(function(error) {
                      console.error("Authentication failed:", error);
                    });



            } else {
                alert('Facebook login failed');
            }
        });
  }

  var ref = firebase.database().ref('users');
  var userInfo;

$scope.getUserInfo = function() {
  //Initialize FACEBOOK SDK
  $window.fbAsyncInit = function() {
      FB.init({
        appId: '694354544087073',
        status: true,
        cookie: true,
        xfbml: true,
        version: 'v2.10'
      });
      FB.getLoginStatus(function(response){
        if (response.status === "connected")
        {
          console.log(response);

          FB.api('/me/?fields=id,name,gender,birthday,email,picture', function(res){
            if (!res || res.error) {
              console.log(error);

            }
            else {
              console.log(res);
              userInfo = {
                fbid: res.id,
                name: res.name,
                gender: res.gender,
                birthday: res.birthday,
                email: res.email,
                photoURL: res.picture.data.url
              }
              var ref = firebase.database().ref("users/" + currentUserUid);
              console.log(userInfo);
              ref.update(userInfo);
            }
          })
          //GET ALL FRIENDS
          FB.api('/me/friends?limit=5000', function(res){
            if(!res || res.error){
              console.log('Error occured while fetching user friends who use the app.');
            }
            else{
              console.log(res);

              var ref = firebase.database().ref('users/' + currentUserUid + "/friendsinapp");
              ref.update(res);
              // var ref = firebase.database().ref("users/"+user.uid+"/friendsinapp");
              // ref.update(res);
              }
            })
        }
        else {
          console.log("No Facebook user is connected.");
        }
      });
    }
  }



});
