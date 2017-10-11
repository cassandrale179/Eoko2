app.controller('chatTabCtrl', ['$scope', '$firebaseArray','$timeout','chatFactory','$firebaseObject', '$state','$ionicLoading', '$ionicPopup',
  function ($scope, $firebaseArray, $timeout,chatFactory,$firebaseObject,$state,$ionicLoading, $ionicPopup) {


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
        try{
          console.log("chatData try", chatdata);
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
        }catch(exception){
          console.log("EXCEPTIONS ", exception);
          console.log("chatData exception", chatdata);
          firebase.database().ref('users').child($scope.userInfo.uid + '/chat/' + i).remove();
        }

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

  //---------------------------DELETING A CHAT -------------------------

  $scope.deleteChat = function(convoID){
    showNotifyAlert("Are you sure you want to delete this conversation?", convoID);
  }

  function showNotifyAlert(message, convoID){
    console.log("convo ID", convoID);
    //------- POPUP TO ASK FOR USER CONFIRMATION --------
    $scope.blurry = {behind: "5px"};
    var confirmPopup = $ionicPopup.confirm({
      title: 'Error',
      cssClass: 'eoko-alert-pop-up',
      template: message
    });
    //------------- IF USER AGREES TO DELETE AN ACTION------
    confirmPopup.then(function(res) {
      if(res)
      {
        //Delete chat from Chats Database AND user database
        var chatIDRef = firebase.database().ref(`Chats/${convoID}/ids`);
        var userChatRef = firebase.database().ref(`users/${$scope.currentUser.uid}/chat`);

        userChatRef.orderByChild('chatID').equalTo(convoID).on("child_added", function(response){
          var key = response.key;
          userChatRef.child(key).remove();
        })

        chatIDRef.orderByChild('id').equalTo($scope.currentUser.uid).on("child_added", function(response){
          var key = response.key;
          console.log(key);
          chatIDRef.child(key).remove();
          chatLoop();

        })
        // var chatIDArray = $firebaseArray(chatIDRef).$loaded();
        // var userChatArray = $firebaseArray(userChatRef).$loaded();
        // Promise.all([chatIDArray, userChatArray]).then(function(response){
        //   console.log('response', response);
        //   var chatIDArray = response[0];
        //   var userChatArray = response[1];
        //   var removePromise1;
        //   var removePromise2;
        //
        //   //Remove from chat database
        //   angular.forEach(chatIDArray, function(value, key){
        //     if (value.id==$scope.currentUser.uid){
        //       console.log("Found!");
        //       removePromise1 = chatIDArray.$remove(value);
        //     }
        //
        //   })
        //
        //   angular.forEach(userChatArray, function(value, key){
        //     if (value.chatID == convoID){
        //       console.log("Found chat, time to delete!");
        //       removePromise2 = userChatArray.$remove(value);
        //       // Promise.all([removePromise1, removePromise2]).then(function(res){
        //       //   $state.go('navController.chat');
        //       // })
        //
        //
        //
        //
        //     }
        //     Promise.all([removePromise1, removePromise2]).then(function(response){
        //       console.log(response);
        //       $scope.$apply();
        //     })
        //   })
        //
        //
        //
        // })
        // return true;
      }

      //----------- IF USER DID NOT WANT TO DELETE AN ACTION------
      else
      {
        $scope.blurry = {behind: "0px"};
        return false;
      }

    });



  }

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
