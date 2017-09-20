app.controller('loginCtrl', ['$scope', '$cordovaOauth','$firebaseAuth', '$state', '$http', 'ngFB', '$window','geoPos',
  function ($scope, $cordovaOauth, $firebaseAuth, $state, $http, ngFB, $window,geoPos) {


//app.controller('loginCtrl', function($scope, $cordovaOauth, $firebaseAuth, $state, $http, ngFB, $window,) {
  var fbAppId = '694354544087073';
  $scope.authObj = $firebaseAuth();
  var userInfo;
  var currentUserUid;


  $scope.authObj.$onAuthStateChanged(function(firebaseUser){
    if (firebaseUser){
      console.log("Signed in as: " + firebaseUser.uid);
      currentUserUid = firebaseUser.uid;
    }
    else {
      console.log("Signed out");
    }
  });

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


                      // $scope.getUserInfo();
                      $state.go('tabsController.actionList');

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



  }]);


//