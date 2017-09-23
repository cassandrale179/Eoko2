app.controller('actionListCtrl', ['$scope', '$state','$firebaseArray', '$http','$timeout', 'geoPos','$filter','chatFactory',

  function ($scope, $state, $firebaseArray, $http, $timeout, geoPos,$filter,chatFactory) {

    //A LOOP TO CHECK IF THE CU
    $scope.nudge = 0;
    function geoLoop(id)
    {
      try{
              geoPos.updateFirebase(id);
              console.log("position set on firebase");
              $scope.myloc = geoPos.getUserPosition();
              getFriends();
            }
            catch(error)
            {
              $timeout(function(){
                geoLoop(id);
              },1000);
            }
    }

        //CHECKING IF USER IS LOGIN THROUGH ONAUTH STATE CHANGE
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            $scope.currentUser = user;

            geoLoop(user.uid);
        }
        console.log($scope.currentUser.uid);

        //GET CURRENT USERID
        var userRef = firebase.database().ref("users/" + $scope.currentUser.uid);
        userRef.on("value", function(snapshot){
          $scope.low = snapshot.val().low;
          $scope.high = snapshot.val().high;
          console.log("Age Range: " + $scope.low + "," + $scope.high);

        })

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
        $scope.distList = [];
        $scope.peopleList = [];


        angular.forEach(x, function(value,key)
        {

          //CALCULATE THE USER'S AGE FRIENDS
          var currentTime = new Date()
          $scope.year = currentTime.getFullYear();
          var birthyear = value.birthday;
          var substring = birthyear.substring(birthyear.length - 4);
          $scope.birthnum = parseFloat(substring);
          $scope.age = $scope.year - $scope.birthnum


          //PUSHING ALL THE NECESSARY INFORMATION INTO THE DISTANCE LIST OBJECT
          this.push({
            'id': value.uid,
            'dist': $scope.distFromPlayer(value.location),
            'age': $scope.age
          });
        },$scope.distList);




       console.log("SCOPEFRIENDS",  $scope.friends);

         $scope.friends.$watch(function(event)
         { //watch the database for changes
          console.log(event);

          if(event.event == "child_changed")
          {
            $scope.peopleList = [];
            angular.forEach($scope.distList, function(value,key)
            {
              if(value.id == event.key)
              {
                console.log("updating location");
                value.dist = $scope.distFromPlayer($scope.friends.$getRecord(event.key).location);
              }
            },$scope.distList);

           $scope.distList = $filter('orderBy')($scope.distList, 'dist', false);
           angular.forEach($scope.distList, function(value,key)
            {
              var rec = $scope.friends.$getRecord(value.id);
              this.push(rec);

            },$scope.peopleList);
          }

        });

         $scope.distList = $filter('orderBy')($scope.distList, 'dist', false);
          angular.forEach($scope.distList, function(value,key)
          {
            console.log(value.age);
            var rec = $scope.friends.$getRecord(value.id);
            this.push(rec);
          },$scope.peopleList);
          console.log("people")
          console.log($scope.peopleList);
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

        //$scope.distList = [];

        $scope.distFromPlayer = function(locationdata) {
          console.log("distFromPlayer executed");
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
                //$scope.distList.push(result);
                console.log("this is the distList", $scope.distList);
                return result;
            }
          }
        };

         $scope.distSorter = function(x)
          {
            var result;
              angular.forEach($scope.distList, function(value,key)
              {
                if(value.id == x.$id)
                {
                  console.log("found,", key);
                  result = key;
                }
              },$scope.distList);

             return result;
          };
  }]);
