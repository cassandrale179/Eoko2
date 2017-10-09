app.controller('loginCtrl', ['$scope', '$cordovaOauth','$firebaseAuth', '$state', '$http', 'ngFB', '$window','geoPos', 'facebookService', '$ionicPlatform','backcallFactory',

  function ($scope, $cordovaOauth, $firebaseAuth, $state, $http, ngFB, $window, geoPos, facebookService, $ionicPlatform,backcallFactory) {

  var fbAppId = '694354544087073';
  $scope.authObj = $firebaseAuth();
  var userInfo;
  var currentUserUid;
  backcallFactory.backcallfun();

  //------- CHECK IF USER IS LOGIN, IF SO REDIRECT OT ACTION LIST PAGE --------
   $scope.authObj.$onAuthStateChanged(function(firebaseUser){
            if (firebaseUser){
              console.log("Signed in as: " + firebaseUser.uid);
              currentUserUid = firebaseUser.uid;


              //GET USER INFO
              //facebookService can be found in js/service.js
              facebookService.getUserInfo(firebaseUser);
              $state.go('navController.people');
            }
            else {
              console.log("Signed out");
            }
          });


  // ----------- GET THEIR EMAIL, BIRTHDAY AND FRIENDS USING OPEN FACEBOOK API ---------------
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

                    //------------- LOGIN INTO FIREBASE WITH FACEBOOK ACCESS TOKEN ----------------
                    $scope.authObj.$signInWithCredential(credential).then(function(firebaseUser) {
                      console.log("Credential signed in as:", firebaseUser.uid);
                      currentUserUid = firebaseUser.uid;
                      console.log("ready?", geoPos.isReady());



                      //GET USER INFO
                      //facebookService can be found in js/service.js
                      facebookService.getUserInfo(firebaseUser);

                      //Store firebase UID in database
                      var ref = firebase.database().ref('users/'+currentUserUid);
                      ref.update({
                        uid: currentUserUid,
                        high: 100,
                        low: 0,
                        display: "private",
                        peopleFilter: "private",
                        privacy: "private"
                      });


                      $state.go('navController.people');
                    }).catch(function(error) {
                      console.error("Authentication failed:", error);
                    });

            } else {
                alert('Facebook login failed');
            }
        });
  }
}]);
