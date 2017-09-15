app.controller('loginCtrl', function($scope, $cordovaOauth, $firebaseAuth, $state, $http, ngFB) {
  var fbAppId = '694354544087073';
  $scope.authObj = $firebaseAuth();
  var userInfo;
  var uid;

  $scope.authObj.$onAuthStateChanged(function(firebaseUser){
    if (firebaseUser){
      console.log("Signed in as: " + firebaseUser.uid);
      // $scope.getUserInfo(firebaseUser.uid);
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
                      uid = firebaseUser.uid;
                      $scope.getUserInfo(uid);

                    }).catch(function(error) {
                      console.error("Authentication failed:", error);
                    });



            } else {
                alert('Facebook login failed');
            }
        });
  }
  // $scope.login = function() {
  //   var uid;
  //
  //   //Cordova OAuth Facebook Login
  //   $cordovaOauth.facebook(fbAppId,["email", "user_birthday", "user_friends"]).then(function(result){
  //     console.log("User is logged in: " + result.access_token);
  //
  //     // Facebook authentication with credential
  //     var credential = firebase.auth.FacebookAuthProvider.credential(
  //       result.access_token
  //     );
  //
  //     $scope.authObj.$signInWithCredential(credential).then(function(firebaseUser) {
  //       console.log("Credential signed in as:", firebaseUser.uid);
  //       uid = firebaseUser.uid;
  //
  //     }).catch(function(error) {
  //       console.error("Authentication failed:", error);
  //     });
  //     $scope.getUserInfo(uid);
  //     $state.go('actionCreate');
  //   })
  // }

  var ref = firebase.database().ref('users');
  var userInfo;




  $scope.getUserInfo = function(uid) {
    var ref = firebase.database().ref('users/' + uid);

    // openFB.api({
    //   path: '/v2.10/me?fields=birthday, gender, id, name, picture',
    //   success: function(res) {
    //     console.log("1st res", res);
    //   }
    // })

    // openFB.api('/me?fields=birthday, gender, id, name, picture', function(res){
    //   if(!res || res.error){
    //     console.log('Error occured while fetching user details.');
    //   }else{
    //     console.log(res);
    //     userInfo = {
    //       birthday: res.birthday,
    //       gender: res.gender,
    //       fbid: res.id,
    //       name: res.name,
    //       email: res.email,
    //       photoURL: res.picture.data.url
    //     }
    //
    //   }
    //   ref.update(userInfo);
    //
    // });

    openFB.getLoginStatus(function(response) {
          if (response.status === 'connected') {
            console.log('Logged in.');

            var accessToken = response.authResponse.accessToken;
            console.log("API call access token", accessToken);

            openFB.api({
                            path: "/me",
                            params: { "access_token": accessToken, "?fields":"name,email,gender,birthday&access_token='"+accessToken+"'" },
                            success: function (response) {

                               // do whatever you want with the data for example
                               console.log(response);

                            },
                            error: function(err){
                            console.log(err);
                           }
                        });

          openFB.api({
            path: '/me/taggable_friends?limit=5000',
            success: function(response) {
              console.log(response);
            },
            error: function(err) {
              console.log(err);
            }});




          }
          else {
            console.log('initiate FB login...');
            ngFB.login();
          }
        });




  //  GET FRIEND LIST (EVEN IF THEY DO NOT USE THE APP )
    // openFB.api('v2.10/me/taggable_friends?limit=5000', function(res){
    //   if(!res || res.error){
    //     console.log('Error occured while fetching user friends who are not on the app.');
    //   }
    //   else{
    //     console.log(res);
    //     var ref = firebase.database().ref("friends/"+user.uid);
    //     ref.update(res);
    //   }
    // });
    //
    //
    // //GET FRIEND LIST (ONLY THE ONE THAT HAD USED THE APP )
    // openFB.api('/me/friends?limit=5000', function(res){
    //   if(!res || res.error){
    //     console.log('Error occured while fetching user friends who use the app.');
    //   }
    //   else{
    //     console.log(res);
    //     var ref = firebase.database().ref("users/"+user.uid+"/friendsinapp");
    //     ref.update(res);
    //   }
    // });
    //
    //   console.log(userInfo);
  }
});
