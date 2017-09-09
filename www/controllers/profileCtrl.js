app.controller('profileCtrl', ['$scope', '$stateParams', 'UserInfo', 'OtherInfo', '$firebaseObject', '$ionicTabsDelegate', '$timeout', 'ProfilePress', 'ngInstafeed','orderByFilter','$state','$cordovaCamera','$firebaseArray','$ionicScrollDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $stateParams, UserInfo, OtherInfo, $firebaseObject, $ionicTabsDelegate, $timeout, ProfilePress, ngInstafeed,orderByFilter,$state,$cordovaCamera,$firebaseArray,$ionicScrollDelegate) {
    var usr = UserInfo.getUserInfo();
    $scope.toggleEdit = false;

    $scope.$on('$ionicView.beforeEnter', function () //before anything runs
    {
      $scope.user = UserInfo.getUserInfo();
      $scope.toggleEdit = false;

      console.log("STATE PARAMS:", ProfilePress.getState);

      //going from connect Page to view other profile
      if (ProfilePress.getState() == true) {
        $scope.alcick = true;
        console.log("other");
        $ionicTabsDelegate.showBar(false);
        $scope.user = OtherInfo.getOtherInfo();
        console.log($scope.user);
        ProfilePress.setState(false);
        document.getElementById("profileScroll").style = "height: 100%;";

       var selfUser = UserInfo.getUserInfo();
          $scope.isFriend = false;
          for (property in selfUser.friendlist) {
              console.log(property, $scope.user.id)
              if (property == $scope.user.id) {
                  $scope.isFriend = true;
                  $timeout(function(){$scope.$apply();});
                  break;
              }
          }

      }
      else {
        $scope.alcick = false;
        $ionicTabsDelegate.showBar(true);
        document.getElementById("profileScroll").style = "height: calc(100% - 11.5em);";
        if (usr == undefined || usr.email == "") {
          console.log("undefined usr");
          firebase.auth().onAuthStateChanged(function (user) {
            usr = firebase.auth().currentUser;
            $scope.isFriend = true;
            console.log(usr.displayName);
            var ref = firebase.database().ref("Buildings").child(usr.displayName + "/Users/" + usr.uid);
            $scope.user = $firebaseObject(ref);
            $scope.user.$loaded().then(function (x) {
              UserInfo.setUserInfo($scope.user);
              console.log("userinfo: ", $scope.user);
              $timeout(function(){$scope.$apply();});

              $scope.notifyRaw = $scope.user.notifications;
              $scope.notifyData = [];
              console.log("will you show notifications now?",$scope.notifyRaw);

              for(var i in $scope.notifyRaw)
              {
                 console.log("fooofofofo",i);
                 firebase.database().ref("Buildings").child(usr.displayName + "/Users/" + i).once("value").then(
                  function(success)
                  {
                      console.log(success.val());
                      $scope.notifyData.push({
                        'avatar': success.val().avatar,
                          'name': success.val().name,
                            'id': i});
                      console.log("DONE WITH ", $scope.notifyData);
                      $timeout(function(){$scope.$apply();});
                  },
                  function(fail)
                  {

                  });
              }

              var nRaw = firebase.database().ref("Buildings").child(usr.displayName + "/Users/" + usr.uid);

              if ($scope.user.notifications) {
                $scope.friendR = Object.keys($scope.user.notifications).length;
              }
              else {
                $scope.friendR = 0;
              }

            })
              .catch(function (error) {
                console.log("Error:", error);
              });
          });
        }
        else {
          $scope.isFriend = true;
          console.log("userinfo: ", UserInfo.getUserInfo());
          $scope.user = UserInfo.getUserInfo();
          if ($scope.user.notifications) {
            $scope.friendR = Object.keys($scope.user.notifications).length;
          }
          else {
            $scope.friendR = 0;
          }
        }
      }
      $timeout(function(){$scope.$apply();});
      $scope.load.init();
    });


    //Instagram feed
    $scope.data = {
      userId: '3085788730',
    };
    $scope.model = null;
    $scope.ngInstafeedModel = ngInstafeed.model;
    $scope.ngInstafeedState = ngInstafeed.state;

    $scope.load = {
      more: function () {
        ngInstafeed.more(function (err, res) {
          if (err) {
            throw err;
          }
          else {
            console.log(res);
          }
        });
      },
      init: function () {
        $scope.ngInstafeedModel.data = [];
        ngInstafeed.get({
          get: 'user',
          userId: $scope.data.userId
        }, function (err, res) {
          if (err) {
            throw err;
          }
          else {
            console.log(res);
            $scope.model = res;
          }
        });
      }
    };







    //Switching toggle button and change the div
    $scope.toggleEditButton = function () {
      $scope.toggleEdit = true;
       $timeout(function(){$scope.$apply();});

    };

    //This is sending updated information for desctiption and name
    $scope.updateInfo = function() {
      var usr = firebase.auth().currentUser;
      var ref = firebase.database().ref("Buildings").child(usr.displayName + "/Users");
      var info = {name:$scope.user.name, description: $scope.user.description};

      ref.child(usr.uid).update(info, function (success) {
        $scope.toggleEdit = false;
        //refreshes the current scope (refreshes the profile page)
        $timeout(function() {$scope.$apply();});

        //updates the item from the database, so that when you switch templates it shows changes.
        ref = firebase.database().ref("Buildings").child(usr.displayName + "/Users/" + usr.uid);
            var getInfo = $firebaseObject(ref);
            getInfo.$loaded().then(function (x) {
                UserInfo.setUserInfo(getInfo);
                console.log("userinfo: ", getInfo);
              });
      });

    };

    $scope.createMessage = function () {
      var usor = firebase.auth().currentUser;
      var combino = orderByFilter([{
        eyed: usor.uid
      }, {
        eyed: $scope.user.id
      }], 'eyed');
      var uniqueMessageID = combino[0].eyed + '_' + combino[1].eyed;
      console.log(uniqueMessageID);

      var res = firebase.database().ref("Buildings").child(usor.displayName + "/Chats");

      res.child(uniqueMessageID).once('value', function (snapshot) {
        if (snapshot.val() !== null) {

          $state.go('chatPage', {
            'otherID': $scope.user.id,
            'convoID': uniqueMessageID
          });
        }
        else {
          res.child(uniqueMessageID).set({
            'chatTitle': "",
            'chatIDs': [usor.uid, $scope.user.id]
          }).then(function () {

            $state.go('chatPage', {
              'otherID': $scope.user.id,
              'convoID': uniqueMessageID
            });
          });
        }
      });


    };


      function getIonWidth(curr) {
          if (curr.hasClass('item-thumbnail-left')) {
              return curr[0];
          } else {
              return getIonWidth(curr.parent());
          }
      }

      $scope.draggedStyle = {};
      var swiped;

      $scope.onDrag = function(event, index) {
          swiped = false;
          $ionicScrollDelegate.$getByHandle('mainScroll').freezeScroll(true);
          $scope.draggedStyle[index] = {
              "transform": "translate(" + event.gesture.deltaX + "px)",
              "-webkit-transform": "translate(" + event.gesture.deltaX + "px)"
          };
      };

      $scope.onRelease = function(event, index, notify) {
          $ionicScrollDelegate.$getByHandle('mainScroll').freezeScroll(false);
          if (swiped === false) {
              var ionitem = getIonWidth(angular.element(event.srcElement));

              if (event.gesture.deltaX < (ionitem.offsetWidth * 0.618) * -1) {
                  $scope.onSwipeLeft(notify, index);
              } else {
                  $scope.draggedStyle[index] = {
                      "transform": "translate(" + 0 + "px)",
                      "-webkit-transition": "transform 0.61s",
                      "-moz-transition": "transform 0.61s",
                      "-ms-transition": "transform 0.61s",
                      "-o-transition": "transform 0.61s",
                      "transition": "transform 0.61s"
                  };
              }

          }
      };

      //vorixo is the best ever!

      $scope.onSwipeLeft = function(notify, index) {
          console.log(index);
          swiped = true;
          $scope.draggedStyle[index] = {
              "transform": "translate(" + -100 + "%)",
              "-webkit-transition": "transform 0.61s",
              "-moz-transition": "transform 0.61s",
              "-ms-transition": "transform 0.61s",
              "-o-transition": "transform 0.61s",
              "transition": "transform 0.61s"
          };
          $timeout(function() {
              console.log("Swiped left, remove object");


              delete $scope.draggedStyle[index];
              //$scope.draggedStyle[index] = {};
              $scope.notifyData.splice(index, 1);
              console.log(index);
              var authUser = firebase.auth().currentUser;
              var ref = firebase.database().ref("Buildings").child(usr.displayName + "/Users/").child(authUser.uid);


              ref.child('notifications/' + notify.id).remove().then(function() {
                  console.log("object removed from database");
              });

          }, 610);

          /**/
      };

        $scope.acceptRequest = function(info, notify, index) {
          //var myself = UserInfo.getUserInfo();
          authUser = firebase.auth().currentUser;
          console.log("adding friend", info);
          var ress = firebase.database().ref("Buildings").child(authUser.displayName + "/Users/" + authUser.uid);
          ress.child('friendlist').child(info.id).set({
              confirmed: true
          });
          var rsp = firebase.database().ref("Buildings").child(authUser.displayName + "/Users/" + info.id);
          rsp.child('friendlist').child(authUser.uid).set({
              confirmed: true
          });
          var u = $firebaseObject(ress);
          u.$loaded().then(function(x) {
              UserInfo.setUserInfo(u, usr.uid);
          });
          $timeout(function(){$scope.onSwipeLeft(notify, index);}, 200);
      };

      $scope.denyRequest = function(notify, index) {
          $timeout(function(){$scope.onSwipeLeft(notify, index);}, 200);
      };


    $scope.addFriend = function(info) {
          var myself = UserInfo.getUserInfo().id;
          if(myself == undefined)
          {
            myself = usr;
            console.log("I am me now?", myself);
          }
          usr = firebase.auth().currentUser;
          console.log("adding friend", info);
          var ress = firebase.database().ref("Buildings").child(usr.displayName + "/Users/" + usr.uid);
          ress.child('friendlist').child(info.id).set({
              confirmed: false
          });
          var rsp = firebase.database().ref("Buildings").child(usr.displayName + "/Users/" + info.id);
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
          $timeout(function() {
                      $scope.$apply();
                  });
      };

      //upload new picture

      function b64toBlob(b64Data, contentType, sliceSize) { //blobs galore
          contentType = contentType || '';
          sliceSize = sliceSize || 512;

          var byteCharacters = atob(b64Data);
          var byteArrays = [];

          for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
              var slice = byteCharacters.slice(offset, offset + sliceSize);

              var byteNumbers = new Array(slice.length);
              for (var i = 0; i < slice.length; i++) {
                  byteNumbers[i] = slice.charCodeAt(i);
              }

              var byteArray = new Uint8Array(byteNumbers);

              byteArrays.push(byteArray);
          }

          var blob = new Blob(byteArrays, {
              type: contentType
          });
          return blob;
      }


      var randID = "";

      $scope.uploadPic = function() {
          console.log("upload picture");

          var options = {
              quality: 75,
              destinationType: 0, //URL = 0, URI = 1;
              sourceType: 0,
              allowEdit: true,
              encodingType: 0,
              targetWidth: 500,
              targetHeight: 500,
              saveToPhotoAlbum: false
          };

          $cordovaCamera.getPicture(options).then(function(imageData) {
              console.log(imageData);
              var contentType = 'image/jpeg';
              var blob = b64toBlob(imageData, contentType);
              console.log("a new blob, ", blob);
              console.log("blobs URL, ", $scope.user.image);

              randID = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
              firebase.storage().ref().child('profilePics/' + randID + ".jpg").put(blob).then(function(snapshot) {
                  console.log('Uploaded a blob !');
                  $scope.user.avatar = snapshot.downloadURL;
                  var ress = firebase.database().ref("Buildings").child(usr.displayName + "/Users/" + usr.uid);
                  ress.update({
                      avatar: snapshot.downloadURL
                  });
                  $timeout(function() {
                      $scope.$apply();
                  });
              });


          });
      };

  }])
