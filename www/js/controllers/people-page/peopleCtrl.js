app.controller('connectCtrl', ['$scope', '$state', '$stateParams', 'UserInfo', 'OtherInfo', '$firebaseArray', '$firebaseObject', '$ionicPopover', 'orderByFilter', '$ionicTabsDelegate', 'ProfilePress','$timeout', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $state, $stateParams, UserInfo, OtherInfo, $firebaseArray, $firebaseObject, $ionicPopover, orderByFilter, $ionicTabsDelegate, ProfilePress,$timeout) {

    var usr = UserInfo.getUserInfo();
    var usor = firebase.auth().currentUser;
    var ref;

    $scope.searchbarDisplay = false;
    $scope.namequery = {search:""};

    $scope.$on('$ionicView.beforeLeave', function(){
      console.log("THIS IS THE FILTERED LIST:",$scope.filteredUserList);
      $scope.searchbarDisplay = 'false';
      $scope.namequery = {search:""};
    });

    $scope.displayResults = function()
    {
      var dataset;
      if($scope.selection.tab == "everyone")
      {
        dataset = $scope.OrigUserList;
      }
      else
      {
        dataset = $scope.Origfriendlist;
      }

      var newUserList = [];
      for(var i in dataset)
      {
        for(var j in dataset[i])
        {
          if(dataset[i][j].name != undefined && dataset[i][j].name.toLowerCase().includes($scope.namequery.search.toLowerCase()))
          {
            newUserList.push(dataset[i][j]);
          }
        }
      }

      if($scope.selection.tab == "everyone")
      {
        $scope.userList = chunk(newUserList, 3);
      }
      else
      {
        $scope.friendlist = chunk(newUserList, 3);
      }

    };

     $scope.$on('$ionicView.leave', function () //before anything runs
    {
      $scope.closePopover();
      $scope.blurry.behind = "0px";
       $timeout(function(){$scope.$apply();});
    });


    $scope.closeSearchbar = function()
    {
      console.log("pressed");
      $scope.searchbarDisplay = 'false';
    };

    $scope.searchPerson = function()
    {
      $scope.searchbarDisplay = 'true';
    };


    $scope.selection = {tab: "everyone"};
    $scope.$on('$ionicView.beforeEnter', function () //before anything runs
    {
      $ionicTabsDelegate.showBar(true);
      if (usor == undefined) {
        console.log('running once!')
        firebase.auth().onAuthStateChanged(function (user) {
          usor = firebase.auth().currentUser;
          ref = firebase.database().ref("Buildings").child(usor.displayName + "/Users");

          var tempdata = $firebaseObject(ref.child(usor.uid));
          tempdata.$loaded().then(function (w) {
            UserInfo.setUserInfo(tempdata);
            console.log("TempData",tempdata);
            usr = UserInfo.getUserInfo();

            console.log(usr);
            $scope.userList = $firebaseArray(ref);
            $scope.userList.$loaded().then(function (x) {
              $scope.userList = chunk(x, 3);
              $scope.OrigUserList = $scope.userList;

              console.log("usr import", usr);
              $scope.friendlist = [];
              var tempfriendlist = [];
              if(Object.keys(usr.friendlist).length > 0)
              {
                for (var i in Object.keys(usr.friendlist))
                {
                  console.log("getkey", Object.keys(usr.friendlist)[i]);
                  for (var j = 0; j < x.length; j ++)
                  {
                    if(Object.keys(usr.friendlist)[i] == x[j].$id)
                    {
                      console.log("found friend;",x[j]);
                      tempfriendlist.push(x[j]);
                    }
                  }
                }
              }
              $scope.friendlist = chunk(tempfriendlist, 3);
              $scope.Origfriendlist = $scope.friendlist;
              //console.log("friendlist",usr.friendlist);

              console.log("userlist",$scope.OrigUserList);
            })
              .catch(function (error) {
                console.log("Error:", error);

              });

            $scope.owning = {id: tempdata.$id};
            console.log($scope.owning);


          })
            .catch(function (error) {
              console.log("Error:", error);
            });
        });
      }
      else {
        usr = UserInfo.getUserInfo();
        ref = firebase.database().ref("Buildings").child(usor.displayName + "/Users");
        console.log(usr);
        $scope.userList = $firebaseArray(ref);
        $scope.userList.$loaded().then(function (x) {
          $scope.userList = chunk(x, 3);
          $scope.OrigUserList = $scope.userList;

          $scope.friendlist = [];
              var tempfriendlist = [];
              if(Object.keys(usr.friendlist).length > 0)
              {
                for (var i in Object.keys(usr.friendlist))
                {
                  console.log("getkey", Object.keys(usr.friendlist)[i]);
                  for (var j = 0; j < x.length; j ++)
                  {
                    if(Object.keys(usr.friendlist)[i] == x[j].$id)
                    {
                      console.log("found friend;",x[j]);
                      tempfriendlist.push(x[j]);
                    }
                  }
                }
              }
              $scope.friendlist = chunk(tempfriendlist, 3);
              $scope.Origfriendlist = $scope.friendlist;
              //console.log("friendlist",usr.friendlist);

              console.log("userlist",$scope.OrigUserList);


        })
          .catch(function (error) {
            console.log("Error:", error);
          });

        $scope.owning = {id: usor.uid,avatar: usr.avatar};
        console.log($scope.owning);

      }
    });


    $scope.selectEveryoneTab = function () {
      //change css class to udnerline the selected tab
      document.getElementById("EveryoneButton").className = "eoko-button-text-selected eoko-text-button-nav";
      document.getElementById("FriendsButton").className = "eoko-button-text eoko-text-button-nav";
      $scope.selection.tab = "everyone";
    };

    $scope.selectFriendsTab = function () {
      //change css class to udnerline the selected tab
      document.getElementById("EveryoneButton").className = "eoko-button-text eoko-text-button-nav";
      document.getElementById("FriendsButton").className = "eoko-button-text-selected eoko-text-button-nav";
      $scope.selection.tab = "friends";
    };

    function chunk(arr, size) {
      var newArr = [];
      for (var i = 0; i < arr.length; i ++)
      {
        if(arr[i].$id == $scope.owning.id)
          {
            arr.splice(i,1);
          }
      }

      for (var i = 0; i < arr.length; i += size)
      {
        newArr.push(arr.slice(i, i + size));
      }

      return newArr;
    }


    $scope.openProfile = function (clicked) {
      OtherInfo.setOtherInfo(clicked);
      ProfilePress.setState(true);
      $state.go('profile');//, {'aprofile': true},{reload: true});*/
    };


// .fromTemplateUrl() method
    $ionicPopover.fromTemplateUrl('my-popover.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
    });

//$scope.blurry = $scope.popover.isShown() ? $scope.blurry = {behind : "5px"} : $scope.blurry = {behind : "0px"};
    $scope.blurry = {behind: "0px"};

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

    var messageUser;
    $scope.createMessage = function () {
      var combino = orderByFilter([{
        eyed: usor.uid
      }, {
        eyed: messageUser.$id
      }], 'eyed');
      var uniqueMessageID = combino[0].eyed + '_' + combino[1].eyed;
      console.log(uniqueMessageID);

      var res = firebase.database().ref("Buildings").child(usor.displayName + "/Chats");

      res.child(uniqueMessageID).once('value', function (snapshot) {
        if (snapshot.val() !== null) {
          $scope.closePopover();
          $state.go('chatPage', {
            'otherID': messageUser.$id,
            'convoID': uniqueMessageID
          });
        }
        else {
          res.child(uniqueMessageID).set({
            'chatTitle': "",
            'chatIDs': [usor.uid, messageUser.$id]
          }).then(function () {
            $scope.closePopover();
            $state.go('chatPage', {
              'otherID': messageUser.$id,
              'convoID': uniqueMessageID
            });
          });
        }
      });


    };

    $scope.addFriend = function() {
          var myself = UserInfo.getUserInfo().id;
          usr = firebase.auth().currentUser;
          console.log("adding friend", messageUser);
          console.log("youself is :", myself);
          var ress = firebase.database().ref("Buildings").child(usr.displayName + "/Users/" + usr.uid);
          ress.child('friendlist').child(messageUser.$id).set({
              confirmed: false
          });
          var rsp = firebase.database().ref("Buildings").child(usr.displayName + "/Users/" + messageUser.$id);
          rsp.child('notifications').child(myself).set({
              'friendrequest': true
          });
          var u = $firebaseObject(ress);
          u.$loaded().then(function(x) {
              UserInfo.setUserInfo(u, usr.uid);
              $scope.isFriend = true;
          });

          var curUser = firebase.auth().currentUser;
          var ref = firebase.database().ref("Buildings").child(curUser.displayName + "/Users/" + curUser.uid);
                    var usrInfo = $firebaseObject(ref);
                    usrInfo.$loaded().then(function (x) {
                      UserInfo.setUserInfo(usrInfo);
                    });
      };

    function isAFriend(messageUser)
    {
      for(var i in $scope.friendlist)
      {
        for(var j in $scope.friendlist[i])
        {
          //console.log("FRIENDSLIST", $scope.friendlist[i][j]);
          if($scope.friendlist[i][j].$id == messageUser.$id)
          {
            return 'true';
          }
        }
      }
      return 'false';
    }

    $scope.openPopover = function ($event, notify) {
      $scope.blurry.behind = "5px";
      messageUser = notify;
      $scope.friendornot = isAFriend(messageUser);

      $scope.popover.show($event);
      makeblurry();
    };

    $scope.closePopover = function () {
      $scope.blurry.behind = "0px";
      $scope.popover.hide();
      //$scope.popover.remove();
      $scope.friendornot = " ";
    };

    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.popover.remove();
    });

    // Execute action on hide popover
    $scope.$on('popover.hidden', function () {
      makeblurry();
    });

    // Execute action on remove popover
    $scope.$on('popover.removed', function () {
      makeblurry();
    });


  }])
