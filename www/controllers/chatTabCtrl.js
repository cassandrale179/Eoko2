app.controller('chatTabCtrl', ['$scope', '$firebaseArray','$timeout','chatFactory','$firebaseObject',
  function ($scope, $firebaseArray, $timeout,chatFactory,$firebaseObject) {

        

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
          $scope.rawChatInfo = chatFactory.getChatData();
          $scope.rawChatInfo.$watch(function(event)
          {
            if(event.event == "child_removed")
            {
              console.log("event",event.event);
                populateChats();
            }
            
          });
          populateChats();
        }
   }


   function makeName(ids)
   {
      var nameList = [];
      for(var i in ids)
      {
        if(ids[i].id != $scope.currentUser.uid)
        {
            nameList.push(ids[i].name);
        }
      }
      return nameList.join(", ");
   }

    
   function populateChats()
   {
    
      var chatList = chatFactory.getChats($scope.currentUser.uid);
        //console.log("the chat list",chatList);
        $scope.chatData = [];
        for(var i in chatList)
        {
          var chatdata = chatFactory.loadChatData(chatList[i]);
          var chattitle = makeName(chatdata.ids);
            
          console.log(chatdata, chattitle);
          var obj = {
            info: chatdata,
            title: chattitle};
          $scope.chatData.push(obj);
          
          

          
        }
        console.log("chatData",$scope.chatData);
        $timeout(function(){$scope.$apply();});
        
   }

       
  firebase.auth().onAuthStateChanged(function(user) 
  {
    if (user){
      var rez = firebase.database().ref("users").child(user.uid);
      $scope.userInfo = $firebaseObject(rez);
      $scope.userInfo.$loaded();
      $scope.currentUser = user;
      chatLoop();
      }
  });

  $scope.newConversation = function()
  {
    var rec = firebase.database().ref("Chats");
    rec.push({
      name: ""

    }).then(function(success){
        console.log("lets see", success);
        rec.child(success.key).child("ids").push({
          id: $scope.currentUser.uid,
          name: $scope.userInfo.name
        }).then(function(baby)
        {
          console.log( "my baby!");
          populateChats();
          //$state.go('messagePage'); //with params
        });
    });

  };



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
