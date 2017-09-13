app.controller('loginCtrl', function($scope, $firebaseObject) {
  $scope.$on('event:social-sign-in-success', function(event, userDetails){
    console.log(userDetails);
    $state.go('profile');
  })
});
