app.controller('actionListCtrl', ['$scope', '$state','$firebaseArray', '$http','$timeout', 'geoPos','$filter','chatFactory','backcallFactory','$firebaseObject',

  function ($scope, $state, $firebaseArray, $http, $timeout, geoPos,$filter,chatFactory,backcallFactory,$firebaseObject) {

    //GET THE CURRENT USER WHO ARE USING THE APP
    $scope.nudge = 0;
<<<<<<< Updated upstream
    $scope.$on('$ionicView.beforeEnter', function(){
      firebase.auth().onAuthStateChanged(function(firebaseUser){
        $scope.currentUser = firebaseUser;

        // $scope.currentUser.uid = UserInfo.getUser().uid;
      });
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
          getFriends();
         }
       }



      firebase.auth().onAuthStateChanged(function(user) {
=======


    // function geoLoop(id)
    // {
    //   console.log("started geoLoop");
    //   try{
    //           geoPos.updateFirebase(id);
    //           console.log("position set on firebase");
    //           $scope.myloc = geoPos.getUserPosition();
    //           getFriends();
    //         }
    //         catch(error)
    //         {
    //           $timeout(function(){
    //             geoLoop(id);
    //           },1000);
    //         }
    // }



        firebase.auth().onAuthStateChanged(function(user) {
>>>>>>> Stashed changes
          if (user) {
            var rez = firebase.database().ref("users").child(user.uid);
            $scope.userInfo = $firebaseObject(rez);
            $scope.userInfo.$loaded();
            $scope.currentUser = user;
            console.log($scope.currentUser.uid);
            startLoop();
        }


        });



        $scope.newConversation = function(other)
        {
          console.log("started newconvo");
            for(var i in $scope.userInfo.chat)
            {
              var info = chatFactory.loadChatData($scope.userInfo.chat[i].chatID);
              console.log("length is ", Object.keys(info.ids).length);
              if(Object.keys(info.ids).length < 3)
              {
                for(var j in info.ids)
                {
                  console.log("j interate", j, info.ids[j]);
                  if(info.ids[j].id == other.$id)
                  {
                    console.log("FOUDN!!", $scope.userInfo.chat[i].chatID);
                    $state.go('messagePage',{otherID: other.$id, convoID: $scope.userInfo.chat[i].chatID});
                    return;
                  }
                }
              }
            }
            console.log(other);
            var rec = firebase.database().ref("Chats");
            rec.push({
              name: ""

            }).then(function(success){
                rec.child(success.key).child("ids").push({
                  id: $scope.currentUser.uid,
                  name: $scope.userInfo.name,
                  avatar: $scope.userInfo.photoURL
                }).then(function(baby)
                {
                  rec.child(success.key).child("ids").push({
                  id: other.$id,
                  name: other.name,
                  avatar: other.photoURL
                });
                      firebase.database().ref("users").child($scope.currentUser.uid).child('chat').push({
                  'chatID' : success.key
                  }).then(function(ddd)
                  {
                     firebase.database().ref("users").child(other.$id).child('chat').push({
                      'chatID' : success.key
                      }).then(function(ddd)
                      {
                         $state.go('messagePage',{otherID: other.$id, convoID: success.key}); //with params
                      });
                  });
                });
            });
        };




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

          this.push({
            'id': value.uid,
            'dist': $scope.distFromPlayer(value.location)
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
            var rec = $scope.friends.$getRecord(value.id);
            this.push(rec);
          },$scope.peopleList);



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



          //--------------------------------NUDGE FUNCTIONS-----------------------------------
          $scope.eokoNudge = function(x) {
            $scope.nudge=true;
            console.log("nudge: ", $scope.nudge);
            console.log("eoko nudge user: ", $scope.user);

            $scope.otherUser = x;
            console.log("the other person is: ", $scope.otherUser.uid);
            console.log($scope.currentUser);
          }


          $scope.hideEokoNudge = function() {
            $scope.nudge = false;
            console.log("nudge: ", $scope.nudge);

          }

          $scope.sendNudge = function() {
            var uid = $scope.currentUser.uid;
            console.log("current user uid:", uid);

            var ref = firebase.database().ref('nudge/'+uid+"/"+$scope.otherUser.uid);
            var time = Date.now();
            var userRef = firebase.database().ref('users/'+uid);
            userRef.once("value", function(snapshot){
              var location = snapshot.val().location;
              ref.update({
                location: location,
                name: $scope.currentUser.displayName,
                senderUid: uid,
                receiverUid: $scope.otherUser.uid,
                latestTime: time
              })
            })


          }




  }]);
