app.controller('actionCreateCtrl', ['$scope', '$state','$firebaseArray', '$ionicPlatform',
  function ($scope, $state, $firebaseArray, $ionicPlatform) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user){
        console.log("user is logged in.");
        console.log(user);
      }
      else{
        console.log("No user")
      }
    })

    $ionicPlatform.ready(function(){

      var watchId = navigator.geolocation.watchPosition(onSuccess);
      function onSuccess(position) {
        $scope.action.location = "Latitude" + position.coords.latitude + " Longitude: " + position.coords.longitude;
        $state.go('actionCreate');

        console.log('Latitude: '  + position.coords.latitude      + '<br />' +
                              'Longitude: ' + position.coords.longitude     + '<br />' +
                              '<hr />')
                            }

    })


    // ------------ THIS ALLOW USER TO MOVE BETWEEN TWO DIFFERENT SCREENS ON CREATE ACTION PAGE  --------
    $scope.description = 0;
    $scope.action={};


    // ------------ WHEN USER CLICK SUBMIT, THIS FUNCTION WILL HAPPEN --------
    $scope.submit = function(){
      console.log($scope.action);
    }
  }])
