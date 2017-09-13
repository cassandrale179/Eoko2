app.controller('loginCtrl', function($scope, $firebaseObject, $state) {
  $scope.$on('event:social-sign-in-success', function(event, userDetails){
    console.log(userDetails);
    $state.go('profile');
  })
});
