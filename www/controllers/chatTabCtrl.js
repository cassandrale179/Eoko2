app.controller('chatTabCtrl', ['$scope', '$state','$firebaseArray', '$http', '$timeout', 'geoPos','$filter',
  function ($scope, $state, $firebaseArray, $http, $timeout, geoPos,$filter) {

    //-------------- GET THE CURRENT USER WHO ARE USING THE APP--------------
    
       function geoLoop(id)
    {
      try{
              geoPos.updateFirebase(id);
              console.log("position set on firebase");
              $scope.myloc = geoPos.getUserPosition();
              getEvents();
            }
            catch(error)
            {
              $timeout(function(){
                geoLoop(id);
              },1000);
            }
    }


        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            console.log("auth changed");
            $scope.currentUser = user;
            geoLoop(user.uid);
        }
        console.log("userID is:",$scope.currentUser.uid);
          
        });



  

    //--------------------- GET ALL THE EVENTS OF THE USER -----------------
    function getEvents()
    {
      var eventsRef = firebase.database().ref("activities/");
      $scope.events = $firebaseArray(eventsRef);
      $scope.events.$loaded().then(function(x) 
      {
        console.log("Event List: ", $scope.events);
        angular.forEach($scope.events, function(event){
          var userRef = firebase.database().ref("users/" + event.userID);
          userRef.on("value", function(snapshot){
            event.photoURL = snapshot.val().photoURL;


          });
        });


        $scope.distList = [];
        $scope.eventList = [];
        angular.forEach(x, function(value,key)
        {
          this.push({
            'id': value.id,
            'dist': $scope.distFromPlayer(value.location)
          });
        },$scope.distList);

       console.log("SCOPEFRIENDS",  $scope.distList);

         $scope.events.$watch(function(event) 
         { //watch the database for changes
          console.log(event);

          if(event.event == "child_changed")
          {
            $scope.eventList = [];
            angular.forEach($scope.distList, function(value,key)
            {
              if(value.id == event.key)
              {
                console.log("updating location");
                value.dist = $scope.distFromPlayer($scope.events.$getRecord(event.key).location);
              }
            },$scope.distList);

           $scope.distList = $filter('orderBy')($scope.distList, 'dist', false);
          angular.forEach($scope.distList, function(value,key)
          {
            var rec = $scope.events.$getRecord(value.id);
            this.push(rec);
          },$scope.eventList);
          }

        });

         $scope.distList = $filter('orderBy')($scope.distList, 'dist', false);
          angular.forEach($scope.distList, function(value,key)
          {
            var rec = $scope.events.$getRecord(value.id);
            this.push(rec);
          },$scope.eventList);


      });
    }

    
      
    //--------------------- CALCULATE DISTANCE FOR USERS -----------------
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

       // $scope.distList = [];

        //---------------------- DISTANCE FROM THE CURRENT USER ------------------
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
                $timeout(function(){$scope.$apply();});
                //return Math.round(result * 10) / 10;
                //$scope.distList.push(result);
                return result;
            }
          }
        };


        //--------------------- SORTING THE DISTANCE FROM THE USER ------------------
        /*$scope.distSorter = function(x)
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
        };*/


        /*$scope.distSorter = function(x)
        {
            return $scope.distList[x.$index];
        };*/


      //--------------------- REVERSE GEO-ENCODING ------------------------------
      function reverseGeo(geocoder)
      {
        var latlng = "39.9551991,-75.1885332";
        var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "&sensor=false";
        $http.get(url).then(function(response){
          console.log("Formatted Address: " + response.data.results[0].formatted_address);
        });
      }
  }]);
