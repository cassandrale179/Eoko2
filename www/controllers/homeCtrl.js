app.controller('homeCtrl', ['$scope', '$stateParams', '$ImageCacheFactory', '$ionicPlatform', '$timeout', '$firebaseObject', '$state', 'UserInfo', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $stateParams, $ImageCacheFactory, $ionicPlatform, $timeout, $firebaseObject, $state, UserInfo) {

    $ionicPlatform.ready(function () {
      $ImageCacheFactory.Cache([
        "img/main_background.png",
        "img/action_icon_off.png",
        "img/action_icon_on.png",
        "img/empty_profile_icon.png",
        "img/event_icon_on.png",
        "img/event_icon_off.png",
        "img/facebook_icon.png",
        "img/info_icon_off.png",
        "img/info_icon_on.png",
        "img/instagram_icon.png",
        "img/linkedin_icon.png",
        "img/logoWhite.png",
        "img/ionic.png",
        "img/notification_icon.png",
        "img/people_icon_on.png",
        "img/profile_icon_off.png",
        "img/people_icon_off.png",
        "img/profile_icon_on.png",
        "img/twitter_icon.png",
        "img/setting_icon.png"
      ]).then(function () {
        console.log("Images done loading!");
        firebase.auth().onAuthStateChanged(function (user) {
          var usr = firebase.auth().currentUser;
          console.log(usr.displayName);
          var ref = firebase.database().ref("Buildings").child(usr.displayName + "/Users/" + usr.uid);
          var youser = $firebaseObject(ref);
          youser.$loaded().then(function (x) {
            UserInfo.setUserInfo(youser);
            console.log(youser);
            $state.go('tabsController.events');
            $timeout(function(){$scope.$apply();});
          })
            .catch(function (error) {
              console.log("Error:", error);
            });
        });

      });
      $timeout(function () {
        $scope.$apply();
      });

    });


  }])
