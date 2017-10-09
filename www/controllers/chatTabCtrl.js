app.controller('chatTabCtrl', ['$scope', '$firebaseArray','$timeout','chatFactory','$firebaseObject', '$state','$ionicLoading',
  function ($scope, $firebaseArray, $timeout,chatFactory,$firebaseObject,$state,$ionicLoading) {


    $scope.currentUser = firebase.auth().currentUser;

    //before anything runs, get the list of all chats
    $scope.$on('$ionicView.afterEnter', function ()
    {
      showLoadingIndicator();
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
            $ionicLoading.hide().then(function(){
              console.log("The loading indicator is now hidden");
              populateChats();
            });
          }
        });
        $ionicLoading.hide().then(function(){
          console.log("The loading indicator is now hidden");
          populateChats();
        });
      }
    }

  //loading indicator
  function showLoadingIndicator (){
    $ionicLoading.show({
      template: '<div class="loader"></div>',
    }).then(function(){
      chatLoop();
    });
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
      $scope.chatData = [];
      console.log("userInfo", $scope.userInfo);
      for(var i in $scope.userInfo.chat)
      {
        var chatdata = chatFactory.loadChatData($scope.userInfo.chat[i].chatID);
        var chattitle = makeName(chatdata.ids);

        console.log("chatdata: ", chatdata);
        console.log("uid", $scope.currentUser.uid);

        //Add photo for one-on-one chat
        if (chatdata.name==""){
          angular.forEach(chatdata.ids, function(person){
            if (person.id!=$scope.currentUser.uid){
              chatdata.photoURL = person.avatar;
              chatdata.title = person.name;
            }
          })
        }
        var obj = {
          info: chatdata,
          title: chattitle
        };
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

  /*$scope.newConversation = function()
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
          firebase.database().ref("users").child($scope.currentUser.uid).child('chat').push({
            'chatID' : success.key
          });
          populateChats();

          $state.go('messagePage',{otherID: "", convoID: success.key}); //with params
        });
    });

  };*/

  }]);
