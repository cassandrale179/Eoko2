app.controller('eventListCtrl', ['$scope','$stateParams', '$state','$firebaseArray', '$http', '$timeout', 'geoPos','$filter','$firebaseObject','$ionicPopover',
  function ($scope,$stateParams, $state, $firebaseArray, $http, $timeout, geoPos,$filter,$firebaseObject,$ionicPopover) {
    $scope.eventNudge = false;
    $scope.searchBar = 2;
    console.log("State of searchbar");
    console.log($scope.searchBar);



    //start the thing in case it starts here
    firebase.auth().onAuthStateChanged(function(user){
      if (user){
        $scope.currentUser = user;
        startLoop();
      }
    });

    $scope.$on('$ionicView.afterEnter', function () //before anything runs
    {
      $scope.actionActivate = $stateParams.actionID;
      console.log("state params, ", $stateParams.actionID, "triggeredm,, ", $stateParams.SJWTriggered);
      $scope.triggered = $stateParams.SJWTriggered;
      startLoop();
    });

    var res = firebase.database().ref("actions");
        $scope.tagList = $firebaseArray(res);
        $scope.tagList.$loaded().then(function(lad)
        {
          console.log("taglist action", $scope.tagList);

        });

    //just checks if ready
    function startLoop()
    {
       if(geoPos.isReady() == false)
       {
        console.log("geoLoc not ready Yet");
        $timeout(function(){
                startLoop();
              },1000);
       }
       else
       {
        getEvents();
       }
     }

     $scope.searchEventFilter = [];




      //select filter
      $scope.selectFilter = function (elementId)
      {

      var elementClass = document.getElementById(elementId).className;
        if(elementClass == "eoko-horizontal-scroll-button eoko-text-thin activated" || elementClass == "eoko-horizontal-scroll-button eoko-text-thin ng-binding activated")
        {
          document.getElementById(elementId).className = "eoko-horizontal-scroll-button-selected eoko-text-thin";
          $scope.searchEventFilter.push(elementId);

        }else{
          document.getElementById(elementId).className = "eoko-horizontal-scroll-button eoko-text-thin";
          for(var i in $scope.searchEventFilter)
          {
            if($scope.searchEventFilter[i] == elementId)
            {
                  $scope.searchEventFilter.splice(i, 1);

            }
          }
        }
        if($scope.searchEventFilter == [])
        {
          $scope.searchEventFilter = null;
        }
        console.log("searching",$scope.searchEventFilter);
        console.log($scope.events);
        if ($scope.searchEventFilter.length==0 || $scope.searchEventFilter==null){
          console.log("activated");
          angular.forEach($scope.events, function(event){
            event.display=true;
          });
        }
        else{
          angular.forEach($scope.events, function(event){
            var tags = event.info.tags;
            console.log(tags);

            var display = findTags(tags, $scope.searchEventFilter);
            event.display = display;
          });
        }

      };

      //Return true if an element in arr1 is in arr2
      function findTags(arr1, arr2){
        console.log("arr2", arr2);
        result = false;

        angular.forEach(arr1, function(ele){
          console.log(ele);

          if (arr2.indexOf(ele)>-1){
            console.log("found", arr2.indexOf(ele))

            result = true;
          }
          console.log("not found", arr2.indexOf(ele))
        })

        return result;
      }




      //-------------- ALLOW USER TO JOIN AN ACTION ON EOKO ------------------
      $scope.joinAction = function(eventid){
        var ref = firebase.database().ref("activities").child(eventid);
        var checkDone = $firebaseObject(ref);
        checkDone.$loaded().then(function(x){
          console.log("loaded event stuff",checkDone);
          console.log("the thing is ", checkDone);
          if(checkDone.userID == $scope.currentUser.uid)
          {
            console.log("this is your event, exiting");
            $scope.closePopover();
            return;
          }

          for(var i in checkDone["participants"])
          {
            if(checkDone["participants"][i].id == $scope.currentUser.uid)
            {
              console.log("already joined, returning");
              $scope.closePopover();
              return;
            }
          }
            ref.child("participants").push({
              id: $scope.currentUser.uid,
              avatar: $scope.currentUser.photoURL
            }).then(function(succ)
            {
              console.log("successfully added");
              $scope.closePopover();
              return;
            });
        });

      };

    //--------------------- GET ALL THE EVENTS FOR THE USER -----------------

    function loadActions()      //loading the actions from the start
    {
      var result = {};
      for(var i in $scope.eventInfo)
        {
          console.log("i is", $scope.eventInfo[i].$id);
          var index = $scope.eventInfo[i].$id;
          var dist = $scope.distFromPlayer($scope.eventInfo[i].location);
          if(dist != false)
          {
            result[index] = {info: $scope.eventInfo[i], distance: dist, display: true};
          }
        }
        return result;
    }

    function changeAction(actionID)    //change individual actions depending on how it is
    {
      console.log("before events", $scope.events);
      for(var i in $scope.eventInfo)
      {
        if($scope.eventInfo[i].$id == actionID)
        {
          var dist = $scope.distFromPlayer($scope.eventInfo[i].location);
          if(dist != false)
          {
            $scope.events[actionID] = {info: $scope.eventInfo[i], distance: dist};
          }
        }
      }
      console.log("after events", $scope.events);
    }

    function dd()
    {
      console.log("THIS IS THE ULTIMATE SHOWDOWN OF ULTIMATE DESTINY!!!,", $scope.actionActivat, $stateParams.actionID);
      $scope.openPopover("", $scope.events[$scope.actionActivate]);

    }

    $scope.loadedOnce = false;
    function getEvents()  //called in the beginning, thats all
    {

      if($scope.loadedOnce == false)
      {
        var eventsRef = firebase.database().ref("activities/");
          $scope.eventInfo = $firebaseArray(eventsRef);
           $scope.eventInfo.$loaded().then(function(x)
          {
            $scope.loadedOnce = true;
            console.log("event loaded");
            $scope.events = loadActions();
            console.log("total events", $scope.events);

            //create watcher

              $scope.eventInfo.$watch(function(event){
              if(event.event == "child_changed")
              {
                console.log("run result", event);
                changeAction(event.key);
              }
              if(event.event = "child_created")
              {
                $scope.events = loadActions();
              }
             });
          });
      }
      

       

       if($scope.triggered == true)
       {
        dd();
       }
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
          if(locationdata == undefined)
          {
            return false;
          }

          $scope.myloc = geoPos.getUserPosition();

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
                $timeout(function(){
                  $scope.$apply();
                }, 500);
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




      //------------------------POPOVER STUFF----------------------------------

      $scope.$on('$ionicView.loaded', function () {
        $scope.blurry = {behind: "0px"};
      });


        function makeblurry() {
        if ($scope.popover.isShown()) {
          console.log("blur background");
          $scope.blurry = {behind: "5px"};
        }
        else {
          console.log("clear up");
          $scope.blurry = {behind: "0px"};
        }
      }

      $scope.checkHit = function (event) {
        if (event.target.className.includes("popup-container popup-showing")) {
            $scope.closePopover();
        }
      };

      $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope
      }).then(function(popover) {
        $scope.popover = popover;
      });

      $scope.openPopover = function($event, user) {
        $scope.blurry.behind = "5px";
        $scope.currUser = user;
        $scope.popover.show();
      };
      $scope.closePopover = function() {
        $scope.blurry.behind = "0px";
        $scope.popover.hide();
        makeblurry();
      };
      //Cleanup the popover when we're done with it!
      $scope.$on('$destroy', function() {
         $scope.blurry.behind = "0px";
        $scope.popover.remove();
        makeblurry();
      });
      // Execute action on hide popover
      $scope.$on('popover.hidden', function() {
        // Execute action
      });
      // Execute action on remove popover
      $scope.$on('popover.removed', function() {
        // Execute action
      });











  }]);
