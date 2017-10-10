app.controller('messagePageCtrl', ['$scope', '$stateParams', '$firebaseObject', 'UserInfo', '$firebaseArray', '$ionicScrollDelegate', '$timeout',
  function ($scope, $stateParams, $firebaseObject, UserInfo, $firebaseArray, $ionicScrollDelegate, $timeout) {

    var authUser = firebase.auth().currentUser;
      $scope.myId = authUser.uid;
      var ref = firebase.database().ref();
      $scope.receiverInfo = $stateParams.otherID;
      var convoID = $stateParams.convoID;


      var currentnum = 0;

      console.log("partnerObj", $scope.receiverInfo, "convoID", convoID);

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
      if($scope.data.messageText == " " || $scope.data.messageText == "")
      {
        console.log("nothing there, do nothing");
        return;
      }
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

      //Update last text in chat tab
      var chatRef = firebase.database().ref(`Chats/${convoID}`);

      var utcTime = new Date().getTime();
      console.log("UTC Time", utcTime);

      chatRef.update({
        lastText: {
          messageText: $scope.data.messageText,
          userId: authUser.uid,
          userFirstName: authUser.displayName.split(" ")[0],
          utcTime: utcTime
        }
      })

      $scope.data.messageText = "";
      $ionicScrollDelegate.scrollBottom();
    };



    //KEYBOARD
    $scope.keyboardHeight = 271;

    window.addEventListener('native.keyboardshow', keyboardShowHandler);
    function keyboardShowHandler(e){$scope.keyboardHeight = e.keyboardHeight;}

    $scope.showKeyboard = function(){
        if(window.device.platform != 'Android')
        {
          console.log("keyboard height", $scope.keyboardHeight);
          console.log("MessagePageCtrl.js ---- keyboard opens");
          $scope.M4style = "margin-bottom: " + $scope.keyboardHeight + "px";
          $scope.M5style = "height: calc(128.8vw - " + $scope.keyboardHeight + "px)";
          $ionicScrollDelegate.scrollBottom();

          $timeout(function(){
            $scope.$apply();
          });
      }
    };

    window.addEventListener('native.keyboardhide', keyboardHideHandler);
    function keyboardHideHandler(e){console.log("good night baby")}

    $scope.closeKeyboard = function (){
      if(window.device.platform != 'Android')
      {
        console.log("MessagePageCtrl.js ---- keyboard closes");
        $scope.M4style = "margin-bottom: 0px";
        $scope.M5style = "height: 128.8vw";
        $timeout(function(){
          $scope.$apply();
        });
      }
    };


  }]);
