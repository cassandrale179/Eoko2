app.controller('settingPageCtrl', ['$scope', '$state', 'UserInfo', function($scope, $state, UserInfo){



  //signing out current users
  $scope.signoutUser = function(){
    firebase.auth().signOut().then(function (resolve) {
      console.log("Current user signout out!");
      $state.go('home');
    }),
      function(error){
        console.log("Signing out error: ");
        console.log(error);
      }
  };

}])
