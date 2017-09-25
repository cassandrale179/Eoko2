app.controller('messagePageCtrl', ['$scope', '$stateParams', '$firebaseObject', 'UserInfo', '$firebaseArray', '$ionicScrollDelegate',
  function ($scope, $stateParams, $firebaseObject, UserInfo, $firebaseArray, $ionicScrollDelegate) {

    var authUser = firebase.auth().currentUser;
      $scope.myId = authUser.uid;
      var ref = firebase.database().ref();
      var partnerID = $stateParams.otherID;
      var convoID = $stateParams.convoID;
      var currentnum = 0;

      console.log("partnerObj", partnerID, "convoID", convoID);

    $scope.getAvatar = function(id)
    {

    };

      $scope.$on('$ionicView.afterEnter', function () //before anything runs
      {
        console.log("ref is:", ref);
        $ionicScrollDelegate.scrollBottom();
        $scope.messages = $firebaseArray(ref.child('Chats').child(convoID + '/messages'));
        $scope.messages.$loaded()
          .then(function (x) {
            console.log("messages are loaded", x);
            currentnum = Object.keys($scope.messages).length;
          })
          .catch(function (error) {
            console.log("Error:", error);
          });

        
      });


      $scope.data = {messageText: ""};


      $scope.sendMessage = function () {
        console.log("starting messagesend");
        var d = new Date();
        d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
        console.log("message:", $scope.data.messageText);
        console.log("toadded: ", $scope.messages);

        $scope.messages.$add({
          userId: authUser.uid,
          text: $scope.data.messageText,
          time: d,
          avatar: authUser.photoURL

        });
        $scope.data.messageText = "";
        $ionicScrollDelegate.scrollBottom();


      };

      $scope.closeKeyboard = function () {

      };


  }]);
