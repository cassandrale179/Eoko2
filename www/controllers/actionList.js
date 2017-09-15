app.controller('actionListCtrl', ['$scope', '$state','$firebaseArray', '$http', '$ionicPlatform',

  function ($scope, $state, $firebaseArray, $http, $ionicPlatform) {

    //GET THE CURRENT USER WHO ARE USING THE APP
    var currentUser;
    $scope.nudge = 0;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        currentUser = user;
    }
    console.log(currentUser.uid);
    ionicPlatform();
      getFriends();
      //ionicPlatform();
    });


    //GET THE CURRENT USER'S FRIEND LIST
    function getFriends()
    {
      $scope.friends =  [];
      $scope.photos = [];
      var friendsRef = firebase.database().ref("users/");


      $scope.friends = $firebaseArray(friendsRef);
      $scope.friends.$loaded().then(function(x) {
        console.log("gotlist", $scope.friends);
          });

    }


    //------------------distance calculation--------------------

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {   
            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(lat2 - lat1); // deg2rad below
            var dLon = deg2rad(lon2 - lon1);
            var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c; // Distance in km
            return d;
        }

        function deg2rad(deg) {
            return deg * (Math.PI / 180);
        }

        $scope.distFromPlayer = function(locationdata) {      

          if($scope.myloc == undefined || $scope.myloc == null)
          {
            console.log("not yet");
            return 0;
          }
          else
          {
            var arr = locationdata.split(",");
            var lat = arr[0];
            var long = arr[1];

            var arr2 = $scope.myloc.split(",");
            var mylat = arr2[0];
            var mylong = arr2[1];

            if (long == "" || lat == "" || mylong == "" || mylat == "") {
                return "N/A";
            } else {
                var result = getDistanceFromLatLonInKm(mylat, mylong, lat, long) * 0.621371;
                return Math.round(result * 10) / 10;
            }
          } 
        };

        $scope.distSorter = function(x)
        {
          if($scope.myloc == undefined || $scope.myloc == null)
          {
            return 0;
          }
          else
          {
            var result = $scope.distFromPlayer(x.location);
            console.log("got it, its: ", result);
            return result;
          }
        };



    //--------------------- REVERSE GEO-ENCODING ------------------------------
    function reverseGeo(geocoder){
      var latlng = "39.9551991,-75.1885332";
      var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "&sensor=false";
      $http.get(url).then(function(response){
        console.log("Formatted Address: " + response.data.results[0].formatted_address);
      });
    }

    //--------------------- ALWAYS WATCHING USER MOVEMENT AND PUSH IT TO FIREBASE ------\


    function ionicPlatform()  //get geolocation data for current user
    {
      $ionicPlatform.ready(function()
      {

        var watchId = navigator.geolocation.watchPosition(onSuccess);
        function onSuccess(position) 
        {
          var latlng = position.coords.latitude + "," + position.coords.longitude;
          console.log("Latlng under ionic platform: " + latlng);

          //------- CONTINOUSLY UPDATE USER'S LOCATION --------------
          var userRef = firebase.database().ref("users/" + currentUser.uid);
          var obj = {
            location: latlng
          };
          userRef.update(obj);



          $scope.myloc = latlng;  //actual current location

        }
      });


      }



  }]);
