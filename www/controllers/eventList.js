app.controller('eventListCtrl', ['$scope', '$state','$firebaseArray', '$http', '$timeout', 'geoPos','$filter','$firebaseObject',
  function ($scope, $state, $firebaseArray, $http, $timeout, geoPos,$filter,$firebaseObject) {
    $scope.eventNudge = false;


    firebase.auth().onAuthStateChanged(function(user){
      if (user){
        geoPos.updateFirebase(user.uid);
        getEvents();


      }
    })




    //-------------- GET USER CURRENT LOCATION LOOP --------------
    //    function geoLoop(id)
    // {
    //   try{
    //           geoPos.updateFirebase(id);
    //           console.log("position set on firebase");
    //           $scope.myloc = geoPos.getUserPosition();
    //           getEvents();
    //         }
    //         catch(error)
    //         {
    //           $timeout(function(){
    //             geoLoop(id);
    //           },1000);
    //         }
    // }

    //-------------- GET THE CURRENT USER WHO ARE USING THE APP--------------
      //   firebase.auth().onAuthStateChanged(function(user) {
      //     if (user) {
      //       console.log("auth changed");
      //       $scope.currentUser = user;
      //       // geoLoop(user.uid);
      //       $scope.myloc = geoPos.updateFirebase($scope.currentUser.uid);
      //       // geoPos.updateFirebase($scope.currentUser.uid).then(function(data){
      //       //   $scope.myloc = data;
      //       // });
      //
      //       console.log('$scope.myloc', $scope.myloc);
      //       getEvents();
      //
      //   }
      //   console.log("userID is:",$scope.currentUser.uid);
      //
      // });





      $scope.joinAction = function(ownerid, eventid){


        var ref = firebase.database().ref("activities").child(eventid).child("participants");
        var checkDone = $firebaseArray(ref);
        checkDone.$loaded().then(function(x){
          console.log("loaded event stuff",checkDone);

          for(var i in checkDone)
          {
            if(checkDone[i].id == $scope.currentUser.uid)
            {
              console.log("already joined, returning");
              return;
            }
          }

          checkDone.$add({id: $scope.currentUser.uid}).then(function(success)
          {
            console.log("successfully added");
          });


        });

      };



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
            event.owner = snapshot.val().name;

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


          //--------- WHEN THE USER CLICK JOIN AN ACTION ----------


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



          $scope.myloc = geoPos.getUserPosition();

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
                $timeout(function(){
                  $scope.$apply();
                },1000);
                //return Math.round(result * 10) / 10;
                //$scope.distList.push(result);
                return result;
            }
          }
        };



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
