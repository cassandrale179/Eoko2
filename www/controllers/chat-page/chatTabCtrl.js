app.controller('chatTabCtrl', ['$scope', '$stateParams', '$firebaseObject', 'UserInfo', '$firebaseArray', '$ionicScrollDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $stateParams, $firebaseObject, UserInfo, $firebaseArray, $ionicScrollDelegate) {

    var authUser = firebase.auth().currentUser;
    $scope.myId = authUser.uid;
    var ref = firebase.database().ref("Buildings").child(authUser.displayName);
    var partnerID = $stateParams.otherID;
    var convoID = $stateParams.convoID;
    var currentnum = 0;

    $scope.$on('$ionicView.beforeEnter', function () //before anything runs
    {
      ref.child('Chats').child(convoID).once("value").then(function (snap) {
        console.log("the whole chat", snap.val());
        $scope.chatObj = snap.val();
      });

      ref.child('Users').child(partnerID).once("value").then(function (snap) {
        console.log("the partner", snap.val());
        $scope.partner = snap.val();
      });

    });

    $scope.$on('$ionicView.afterEnter', function () //before anything runs
    {
      console.log("ref is:", ref);
      $ionicScrollDelegate.scrollBottom();
      $scope.messages = $firebaseArray(ref.child('Chats').child(convoID + '/messages'));
      $scope.messages.$loaded()
        .then(function (x) {
          console.log("messages are loaded", x)
          currentnum = Object.keys($scope.messages).length;
        })
        .catch(function (error) {
          console.log("Error:", error);
        });
    });

    //   $scope.onSwipeDown = function()
    // {
    //     cordova.plugins.Keyboard.close();
    // };


    $scope.data = {messageText: ""};


    $scope.sendMessage = function () {
      console.log("starting messagesend");
      var d = new Date();
      d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
      console.log("message:", $scope.data.messageText);
      console.log("toadded: ", $scope.messages);
      cordova.plugins.NativeKeyboard.showMessenger({
        onSubmit: function(text) {
        console.log("The user typed: " + text);
        }
      });
      $scope.dynamicChatBarTap();
      if($scope.data.messageText == "" || $scope.data.messageText == " ")
      {
        console.log("nothing was written, exiting");
        return false;
      }
      $scope.messages.$add({
        userId: authUser.uid,
        text: $scope.data.messageText,
        time: d

      });
      $scope.data.messageText = "";
      $ionicScrollDelegate.scrollBottom();


    };

    /*window.addEventListener('native.keyboardshow', keyboardShowHandler);

    function keyboardShowHandler(e){
var onPage5 = document.getElementByID("page5");
log.console("keyBoardEvent")
if (typeof(onPage5) != "undefined" && onPage5 != null) {
        //showAlert('Keyboard height is: ' + e.keyboardHeight);
          document.querySelector("#page5 > ion-content > div.chatBar").style.bottom = e.keyboardHeight+"px";
}
    }

    window.addEventListener('native.keyboardhide', keyboardHideHandler);

    function keyboardHideHandler(e){
      var onPage5 = document.getElementByID("page5");
log.console("keyBoardEvent")
if (typeof(onPage5) == "undefined" && onPage5 == null) {
        //showAlert('Keyboard height is: ' + e.keyboardHeight);
          document.querySelector("#page5 > ion-content > div.chatBar").style.bottom = "0px";
}
   }*/



    // $scope.dynamicChatBar = function () {
    //   console.log("dynamic chat bar activated");
    //   var element = document.getElementById("chatBar"),
    //     style = window.getComputedStyle(element),
    //     bottom = style.getPropertyValue('bottom');
    //   console.log(element+style+bottom); /* this log fixes compiler error with js/ionic, DO NOT REMOVE*/
    //   if (bottom == "0px") {
    //     bottom = "38%";
    //     document.querySelector("#page5 > ion-content > div.chatBar").style.bottom = "38%";
    //   }
    // };

    // $scope.dynamicChatBar = function () {
    //   console.log("dynamic chat bar activated");
    //   var element = document.getElementById("chatBar"),
    //     style = window.getComputedStyle(element),
    //     bottom = style.getPropertyValue('bottom');
    //   console.log(element+style+bottom); /* this log fixes compiler error with js/ionic, DO NOT REMOVE*/
    //   if (bottom == "0px") {
    //     bottom = "36%";
    //     document.querySelector("#page5 > ion-content > div.chatBar").style.bottom = "36%";
    //   }
    // };


    // $scope.dynamicChatBarTap = function () {
    //   console.log("dynamic chat bar activated");
    //   var element = document.getElementById("chatBar"),
    //     style = window.getComputedStyle(element),
    //     bottom = style.getPropertyValue('bottom');
    //   console.log(element+style+bottom); /* this log fixes compiler error with js/ionic, DO NOT REMOVE*/
    //   if (bottom != "0px") {
    //     bottom = "0px";
    //     document.querySelector("#page5 > ion-content > div.chatBar").style.bottom = "0px";
    //   }
    // };


  }])
