app.controller('loginCtrl', ['$scope', '$cordovaOauth','$firebaseAuth', '$state', '$http', 'ngFB', '$window','geoPos', 'facebookService', '$ionicPlatform',

  function ($scope, $cordovaOauth, $firebaseAuth, $state, $http, ngFB, $window, geoPos, facebookService, $ionicPlatform) {

  var fbAppId = '694354544087073';
  $scope.authObj = $firebaseAuth();
  var userInfo;
  var currentUserUid;


  //------- CHECK IF USER IS LOGIN, IF SO REDIRECT OT ACTION LIST PAGE --------
   $scope.authObj.$onAuthStateChanged(function(firebaseUser){
            if (firebaseUser){
              console.log("Signed in as: " + firebaseUser.uid);
              currentUserUid = firebaseUser.uid;


              //GET USER INFO
              //facebookService can be found in js/service.js
              facebookService.getUserInfo(firebaseUser);


              $state.go('actionList');
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

                      //GET USER INFO
                      //facebookService can be found in js/service.js
                      facebookService.getUserInfo(firebaseUser);


                      $state.go('actionList');
                    }).catch(function(error) {
                      console.error("Authentication failed:", error);
                    });

            } else {
                alert('Facebook login failed');
            }
        });



//---------------------- CORDOVA PLUGIN -----------------------
    // $ionicPlatform.ready(function() {
    //   var date = new Date();
    //   cordova.plugins.notification.local.schedule({
    //     id: 1,
    //     title: "Message Title",
    //     message: "Message Text",
    //     firstAt: date, // firstAt and at properties must be an IETF-compliant RFC 2822 timestamp
    //     every: "week", // this also could be minutes i.e. 25 (int)
    //     sound: "file://sounds/reminder.mp3",
    //     icon: "http://icons.com/?cal_id=1",
    //     data: { meetingId:"123#fg8" }
    //   });
    //   cordova.plugins.notification.local.on("click", function (notification) {
    //     joinMeeting(notification.data.meetingId);
    //   });
    // });
  }
}]);
