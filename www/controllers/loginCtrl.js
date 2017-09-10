app.controller('loginCtrl', function($scope, $state, $firebaseObject, $http) {


    $scope.$on('event:social-sign-in-success', function(event, userDetails){
      var userUID = userDetails.uid;
      console.log("User UID" + userDetails.uid);
      console.log(userDetails);
      console.log(userDetails.friends);

      $state.go('tabsController.events')
    // $http({
    // method: 'GET',
    // url: 'http:://v2.10/' + userUID + '/permissions/'
    // }).then(function successCallback(response) {
    //   console.log(response);
    // }, function errorCallback(response) {
    //
    // });


    });






});
