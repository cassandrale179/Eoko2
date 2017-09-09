app.controller('getDescriptionPageCtrl', ['$scope', '$stateParams', '$state','$firebaseObject','UserInfo', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $stateParams, $state,$firebaseObject,UserInfo) {



    $scope.user = {description: ""};
    $scope.submitDescription = function () {
      var usr = firebase.auth().currentUser;
      var ref = firebase.database().ref("Buildings").child(usr.displayName + "/Users");
      ref.child(usr.uid + "/description").set($scope.user.description, function (success)
      {
          var tempdata = $firebaseObject(ref.child(usr.uid));
          tempdata.$loaded().then(function (w) {
            UserInfo.setUserInfo(tempdata);
            console.log("TempData",tempdata);

            console.log("current Usr Info:", UserInfo.getUserInfo());
            $state.go('tabsController.connect');
          });

      });
    };

  }])
