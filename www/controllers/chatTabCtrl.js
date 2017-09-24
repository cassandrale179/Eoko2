app.controller('chatTabCtrl', ['$scope', '$firebaseArray','$timeout','chatFactory','$firebaseObject', '$state',
  function ($scope, $firebaseArray, $timeout,chatFactory,$firebaseObject,$state) {

        

      $scope.currentUser = firebase.auth().currentUser;


      $scope.$on('$ionicView.afterEnter', function () //before anything runs
      {
        populateChats();
      });

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
        rec.child(success.key).child("ids").push({
          id: $scope.currentUser.uid,
          name: $scope.userInfo.name,
          avatar: $scope.userInfo.photoURL
        }).then(function(baby)
        {
          console.log( "my baby!");
          populateChats();

          $state.go('messagePage',{otherID: "", convoID: success.key}); //with params
        });
    });

  };

  }]);
