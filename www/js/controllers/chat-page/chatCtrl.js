app.controller('chatCtrl', ['$scope', '$stateParams', '$firebaseObject', 'UserInfo', '$firebaseArray', '$timeout', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $stateParams, $firebaseObject, UserInfo, $firebaseArray, $timeout) {

    var usr = UserInfo.getUserInfo();
    var authUser = firebase.auth().currentUser;
    var ref;

    $scope.$on('$ionicView.beforeEnter', function () //before anything runs
    {
      if (authUser == undefined) {
        console.log('running once!');
        firebase.auth().onAuthStateChanged(function (user) {
          authUser = firebase.auth().currentUser;
          ref = firebase.database().ref("Buildings").child(authUser.displayName + "/Chats");
          reds = firebase.database().ref("Buildings").child(authUser.displayName + "/Users/" + authUser.uid);

          var objs = $firebaseObject(reds);
          objs.$loaded().then(function (x) {
            UserInfo.setUserInfo(x);
            usr = UserInfo.getUserInfo();

            $scope.conversations = $firebaseArray(ref);
            $scope.conversations.$loaded().then(function (x) {
              getInfo(x);

            })
              .catch(function (error) {
                console.log("Error:", error);
              });
          })
            .catch(function (error) {
              console.log("Error:", error);
            });
        });
      }
      else {
        ref = firebase.database().ref("Buildings").child(authUser.displayName + "/Chats");
        console.log(usr);
        $scope.conversations = $firebaseArray(ref);
        $scope.conversations.$loaded().then(function (x) {
          getInfo(x);

        })
          .catch(function (error) {
            console.log("Error:", error);
          });
      }

    });


    function getInfo(x) {
      var rec = firebase.database().ref("Buildings").child(authUser.displayName + "/Users");
      rec.once('value').then(function (snap) {
        for (var i = 0; i < $scope.conversations.length; i++) {
          //console.log();
          if (x[i].chatIDs.indexOf(authUser.uid) > -1)   //one of my convos
          {

            if (x[i].chatTitle == "")   //two way talk
            {
              console.log("innerfor");
              var lastmessage = "";
              var lasttime = "";
              for (var j in x[i].messages) {
                lastmessage = x[i].messages[j].text;
                lasttime = x[i].messages[j].time;
              }

              partner = (x[i].chatIDs.indexOf(authUser.uid) == 0) ? x[i].chatIDs[1] : x[i].chatIDs[0];

              $scope.conversations[i].avatar = snap.val()[partner].avatar;
              $scope.conversations[i].name = snap.val()[partner].name;
              $scope.conversations[i].partnerID = partner;
              $scope.conversations[i].chatID = x[i].$id;
              $scope.conversations[i].lastmessage = lastmessage;
              $scope.conversations[i].lasttime = lasttime;
            }
          }
        }
        $timeout(function(){$scope.$apply();});
      });
    }

  }])
