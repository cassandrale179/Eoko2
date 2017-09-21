app.controller('chatTabCtrl', ['$scope', '$stateParams', '$firebaseObject', 'UserInfo', '$firebaseArray', '$timeout','chatFactory',
  function ($scope, $stateParams, $firebaseObject, UserInfo, $firebaseArray, $timeout,chatFactory) {

        

      $scope.currentUser = firebase.auth().currentUser;

  function chatLoop()
    {
       if(chatFactory.checkReady() == false)
       {
        console.log("chat not ready Yet");
        $timeout(function(){
                chatLoop();
              },1000);
       }
       else
        {
          populateChats();
        }
   }


   function populateChats()
   {
      var chatList = chatFactory.getChats($scope.currentUser.uid);
        console.log("the chat list",chatList);
        $scope.chatData = [];
        for(var i in chatList)
        {
          console.log("value of that thing is", chatFactory.loadChatData(chatList[i]));
          $scope.chatData.push(chatFactory.loadChatData(chatList[i]));
        }
        
   }

       
  firebase.auth().onAuthStateChanged(function(user) 
  {
    if (user){

      $scope.currentUser = user;
      chatLoop();
      }
  });

      /*function getInfo(x) {
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
          $timeout(function () {
            $scope.$apply();
          });
        });
      }*/


  }]);
