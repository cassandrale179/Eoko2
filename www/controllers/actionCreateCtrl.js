app.controller('actionCreateCtrl', ['$scope', '$state','$firebaseArray', '$ionicPlatform', '$http', 'facebookService',
  function ($scope, $state, $firebaseArray, $ionicPlatform, $http, facebookService) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user){
        console.log("user is logged in.");
        console.log(user);
        facebookService.getMyLastName().then(function(res){
          console.log(response.last_name);
        })
      }
      else{
        console.log("No user")
      }
    })

    $ionicPlatform.ready(function(){

      var watchId = navigator.geolocation.watchPosition(onSuccess);
      function onSuccess(position) {

        var latlng = position.coords.latitude + "," + position.coords.longitude;
        var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "&sensor=false";
        $http.get(url).then(function(response){
          $scope.action.location = response.data.results[0].formatted_address;
        });
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
