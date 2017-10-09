app.controller('actionListCtrl', ['$scope', '$state','$firebaseArray','$http','$timeout', 'geoPos','$filter','chatFactory','$firebaseObject','$ionicPopover','$ionicPopup','$ionicPlatform', 'facebookService', '$localStorage', '$ionicLoading',

  function ($scope, $state, $firebaseArray,  $http, $timeout, geoPos,$filter,chatFactory,$firebaseObject, $ionicPopover, $ionicPopup, $ionicPlatform, facebookService, $localStorage, $ionicLoading) {

    //GET THE CURRENT USER WHO ARE USING THE APP
    $scope.nudge = 0;
    $scope.searchBar = 2;
    $scope.$on('$ionicView.beforeEnter', function(){
      $scope.exitButton = 2;
      firebase.auth().onAuthStateChanged(function(firebaseUser){
        $scope.currentUser = firebaseUser;

        var userRef = firebase.database().ref("users/"+$scope.currentUser.uid);
        userRef.on('value', function(snapshot){
          $scope.peopleFilter = snapshot.val().peopleFilter;


          //Friends list to filter private
          $scope.userFriendsList = snapshot.val().friends;
          console.log('friends List', $scope.userFriendsList)
          console.log('filter', $scope.peopleFilter);
        })
        window.FirebasePlugin.grantPermission();
        window.FirebasePlugin.getToken(function(token) {
              // save this server-side and use it to push notifications to this device
              console.log(token);
              userRef.update({
                messageToken: token
              });

          }, function(error) {
              console.error(error);
          });

          window.FirebasePlugin.onTokenRefresh(function(token) {
              // save this server-side and use it to push notifications to this device
              console.log(token);
              userRef.update({
                messageToken: token
              });

          }, function(error) {
              console.error(error);
          });

          window.FirebasePlugin.onNotificationOpen(function(notification) {
              console.log(notification);
              if (notification.chatId && notification.wasTapped){
                //redirect to chat here

                $state.go('messagePage', {otherID: notification.senderID, convoID: notification.chatId})

              }
              if (notification.nudge){
                //Nudge popup here
                var combined = notification.name + " sent you a nudge! Go to messaging?";
                showNotifyAlert(combined, notification);
              }

          }, function(error) {
              console.error(error);
          });

        // $scope.currentUser.uid = UserInfo.getUser().uid;
      });
    });


    $scope.facebookFuckery = function()
    {
      facebookConnectPlugin.appInvite(
        {
            url: "https://fb.me/705123973010130",
            picture: "https://static1.squarespace.com/static/58001680d2b8579653e773bd/t/59446a67d2b8579c7609ea83/1507244341876/?format=1500w"
        },
        function(obj){
            if(obj) {
                if(obj.completionGesture == "cancel") {
                    console.log("hit cancel");
                } else {
                    console.log("thanks for the invite!");
                }
            } else {
                console.log("what did you do?");
            }
        },
        function(obj){
            // error
            console.log(obj);
        });

    };





     $scope.$on('$ionicView.afterEnter', function () //before anything runs
    {
      makeblurry();
      showLoadingIndicator();
    });


    $scope.blurry = {behind: "0px"};

     function showNotifyAlert(message, info) {
        $scope.blurry = {behind: "5px"};

        var confirmPopup = $ionicPopup.confirm({
          title: 'Error',
          cssClass: 'eoko-alert-pop-up',
          template: message
        });
        confirmPopup.then(function(res) {
          if(res)
          {
            $scope.blurry = {behind: "0px"};
            console.log("redirect to message");
            var req = firebase.database().ref('users').child(info.uid);
            var nudgeUser = $firebaseObject(req);
            nudgeUser.$loaded().then(function(ss)
            {
              $scope.blurry = {behind: "0px"};
              $scope.newConversation(nudgeUser,true);
              return;
            });

          }
          else
          {
            $scope.blurry = {behind: "0px"};
            return;
          }

        });
      }


      //just checks if ready
      function startLoop()
      {
         if(geoPos.isReady() == false)
         {
          //geoPos.isPromiseReady();
          console.log("geoLoc not ready Yet");
          $timeout(function(){
                  startLoop();
                },1000);
         }
         else
         {
          $ionicLoading.hide().then(function(){
            console.log("loading is gone");
            getPeople();
          })

         }
       }


        $scope.doRefresh = function() {

          console.log('Refreshing!');
          $timeout(function()
          {
            //$scope.loadedOnce = false;
            facebookService.getUserInfo($scope.currentUser);
            $scope.loadedOnce = false;
            getPeople();

          },1000);
          $scope.$broadcast('scroll.refreshComplete');
        };


        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            var rez = firebase.database().ref("users").child(user.uid);
            $scope.userInfo = $firebaseObject(rez);
            $scope.userInfo.$loaded();
            $scope.currentUser = user;
            console.log($scope.currentUser.uid);
            startLoop();
        }


        });

        $scope.viewPersonAction = function(actionID, triggered)
        {
          $scope.closePopover();
          $state.go('navController.action',{actionID: actionID, SJWTriggered: true});
        };

        $scope.newConversation = function(other, boo)
        {
          console.log("started newconvo");
            for(var i in $scope.userInfo.chat)
            {
              console.log("dafuq is that,", $scope.userInfo.chat[i].chatID);
              var info = chatFactory.loadChatData($scope.userInfo.chat[i].chatID);
              console.log("length is ", Object.keys(info.ids).length);
              if(Object.keys(info.ids).length < 3)
              {
                for(var j in info.ids)
                {
                  console.log("j interate", j, info.ids[j]);
                  if(info.ids[j].id == other.info.uid)
                  {
                    console.log("FOUDN!!", $scope.userInfo.chat[i].chatID);
                    if(boo)
                    {
                      $state.go('messagePage',{otherID: other.info.uid, convoID: $scope.userInfo.chat[i].chatID});
                    }

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
                  id: other.info.uid,
                  name: other.info.name,
                  avatar: other.info.photoURL
                });
                      firebase.database().ref("users").child($scope.currentUser.uid).child('chat').push({
                  'chatID' : success.key
                  }).then(function(ddd)
                  {
                     firebase.database().ref("users").child(other.info.uid).child('chat').push({
                      'chatID' : success.key
                      }).then(function(ddd)
                      {
                        if(boo)
                        {
                         $state.go('messagePage',{otherID: other.info.uid, convoID: success.key}); //with params
                        }
                      });
                  });
                });
            });
        };

        function loadPeople()      //loading the actions from the start
        {
          console.log("WTF IS GOING ON???");
          var result = {};
          for(var i in $scope.peopleInfo)
            {

              console.log($scope.peopleInfo[i]);
              console.log("i is", $scope.peopleInfo[i].$id);
              var index = $scope.peopleInfo[i].$id;

              var dist = $scope.distFromPlayer($scope.peopleInfo[i].location);
              console.log("what is the dist", dist);
              if(dist != 'false')
              {
                result[index] = {info: $scope.peopleInfo[i], distance: dist, display: true};
              }
            }
            console.log('result', result);
            return result;
        }

        function changePerson(personID)    //change individual actions depending on how it is
        {
          console.log("before people", $scope.people);
          for(var i in $scope.peopleInfo)
          {
            if($scope.peopleInfo[i].$id == personID)
            {
              var dist = $scope.distFromPlayer($scope.peopleInfo[i].location);
              if(dist != 'false')
              {
                $scope.people[personID] = {info: $scope.peopleInfo[i], distance: dist};
              }
            }
          }
          console.log("after events", $scope.people);
        }


        $scope.loadedOnce = false;
        function getPeople()
        {
          if($scope.loadedOnce == false)
          {
            var peopleRef = firebase.database().ref("users");
            $scope.peopleInfo = $firebaseArray(peopleRef);
            $scope.peopleInfo.$loaded().then(function(x)
            {
              $scope.loadedOnce = true;
              $scope.people = loadPeople();
              console.log("straigt from firebase", $scope.peopleInfo);
              console.log("all the people", $scope.people);
              $scope.peopleInfo.$watch(function(event)
              {
                if(event.event == "child_changed")
                {
                  changePerson(event.key);
                }
                if(event.event == "child_created")
                {
                  $scope.people = loadPeople();
                }
              });
            });
          }
        }

    //GET THE CURRENT USER'S FRIEND LIST
    /*function getFriends()
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

    }*/



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
            if(locationdata == undefined)
            {
              return 'false';
            }

            $scope.myloc = geoPos.getUserPosition();

            /*console.log("distFromPlayer executed");
            if($scope.myloc == undefined || $scope.myloc == null)
            {
              console.log("not yet");
              return 0;
            }
            else
            {*/
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
            //}
          };




          //--------------------------------NUDGE FUNCTIONS-----------------------------------
          $scope.checkNudge = function() {
            var userNudgeRef = firebase.database().ref(`users/${scope.currentUser.uid}/nudge/`);

          }

          $scope.eokoNudge = function(x) {
            $scope.nudge=true;
            console.log("nudge: ", $scope.nudge);

            $scope.otherUser = x;
            console.log("the other person is: ", $scope.otherUser.info.uid);
            console.log($scope.currentUser);
          };


          $scope.hideEokoNudge = function() {
            $scope.nudge = false;
            console.log("nudge: ", $scope.nudge);
            $scope.blurry = {behind: "0px"};

          };

          $scope.sendNudge = function() {
            var uid = $scope.currentUser.uid;
            console.log("current user uid:", uid);

            var ref = firebase.database().ref('nudge/'+uid+"/"+$scope.otherUser.info.uid);
            var time = Date.now();
            var userRef = firebase.database().ref('users/'+uid);


            ref.update({

              name: $scope.currentUser.displayName,
              senderUid: uid,
              receiverUid: $scope.otherUser.info.uid,
              latestTime: time
            });

            $scope.newConversation($scope.otherUser,false);
            $scope.closePopover();



          };



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
        $scope.otherUser = user;
        console.log("nudge popover");
        $scope.pop = 'nudge';
        $scope.popover.show();
      };

      $scope.viewProfilePopover = function($event, user) {
        $scope.blurry.behind = "5px";
        $scope.otherUser = user;
        console.log("profile popover");
        $scope.pop = 'profile';
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
        $scope.blurry.behind = "0px";
        // Execute action
      });
      // Execute action on remove popover
      $scope.$on('popover.removed', function() {
        $scope.blurry.behind = "0px";
        // Execute action
      });


      //------------------------LOADING INDICATOR --------------------------
      //loading indicator
     function showLoadingIndicator (){
       $ionicLoading.show({
         template: '<div class="loader"></div>',
       }).then(function(){
           startLoop();
       });
     }




  }]);
