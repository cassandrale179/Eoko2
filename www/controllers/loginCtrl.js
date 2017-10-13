app.controller('loginCtrl', ['$scope', '$cordovaOauth','$firebaseAuth', '$state', '$http', 'ngFB', '$window','geoPos', 'facebookService', '$ionicPlatform','backcallFactory','termsOfService','$ionicPopover',

  function ($scope, $cordovaOauth, $firebaseAuth, $state, $http, ngFB, $window, geoPos, facebookService, $ionicPlatform,backcallFactory,termsOfService,$ionicPopover) {

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
              $scope.checkEULA();
              //$state.go('navController.people');
            }
            else {
              console.log("Signed out");
            }
          });


  // ----------- GET THEIR EMAIL, BIRTHDAY AND FRIENDS USING OPEN FACEBOOK API ---------------
  $scope.BackupLogin = function() {
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
                      geoPos.initGeoPos();
                      $scope.checkEULA();
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
                      //$state.go('navController.people');
                    }).catch(function(error) {
                      console.error("Authentication failed:", error);
                    });

            } else {
                alert('Facebook login failed');
            }
        });
  }

  $scope.login = function()
  {
    facebookConnectPlugin.login(['email, user_birthday, user_friends'],function(response)
    {
      if (response.status === 'connected') {
                console.log('Facebook login succeeded');
                console.log("FB access token: ", response.authResponse.accessToken);
                //Facebook authentication with credential
                    var credential = firebase.auth.FacebookAuthProvider.credential(
                      response.authResponse.accessToken
                    );

                    //------------- LOGIN INTO FIREBASE WITH FACEBOOK ACCESS TOKEN ----------------
                    $scope.authObj.$signInWithCredential(credential).then(function(firebaseUser) {
                      geoPos.initGeoPos();
                      $scope.checkEULA();
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
                      //$state.go('navController.people');
                    }).catch(function(error) {
                      console.error("Authentication failed:", error);
                    });

            } else {
                alert('Facebook login failed');
                $scope.BackupLogin();
            }
    });
  };



  $scope.checkEULA = function()
  {
    console.log("checking eula");

      var fef = firebase.database().ref('users').child(currentUserUid);
      fef.once('value',function(snapshot)
      {
        if(snapshot.val().signedTOS == true)
        {
          console.log("already signed TOS");
          $state.go('navController.people');
        }
        else{
          console.log("did not sign TOS, popup");
          $scope.openPopover();
        }
      });
  };

 $scope.eula = {checkbox: false};

  $scope.submitEULA = function() {
        if($scope.eula.checkbox == true)
        {
          console.log("submitted the eula");
          firebase.database().ref('users').child(currentUserUid).update({signedTOS: $scope.eula.checkbox}).then(
            function()
            {
              $scope.closePopover();
              $state.go('navController.people');
            });
          

        }
        else
        {
          console.log("didnt click checkbox");
        }
      };


      $scope.blurry = {behind: '0px'};

      $ionicPopover.fromTemplateUrl('my-EULA.html', {
          scope: $scope
        }).then(function(popover) {
          $scope.popover = popover;
        });

        $scope.openPopover = function() {
        $scope.blurry.behind = "5px";
        $scope.popover.show();
      };

      $scope.closePopover = function() {
        $scope.blurry.behind = "0px";
        $scope.popover.hide();
      };
      //Cleanup the popover when we're done with it!
      $scope.$on('$destroy', function() {
         $scope.blurry.behind = "0px";
        $scope.popover.remove();
      });
      // Execute action on hide popover
      $scope.$on('popover.hidden', function() {
        $scope.blurry.behind = "0px";
        // Execute action
      });
      // Execute action on remove popover
      $scope.$on('popover.removed', function() {
        $scope.blurry.behind = "0px";
        // Execute action
      });



}]);
