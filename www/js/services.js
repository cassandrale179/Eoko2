angular.module('eoko.services', [])


  .factory('UserInfo', [function () {
    var userData = {
      email: "",
      uid: "",
      name: "",
      birthday: "",
      friendsList: ""
    };

    return {
      setUserInfo: function (info) {
        userData = {
          uid: info.uid,
          name: info.name,
          email: info.email,
          birthday: info.birthday,
          imageUrl: info.imageUrl,
          token: info.token
        };
        return true;
      },

      getUserInfo: function () {
        return userData;
      }
    };

  }])


  .factory('OtherInfo', [function () {
    var userData = {
       id:"",
      name: "",
      email: "",
      birthday: "",
      points: 0,
      eventCount: 0,
      surveyCount: 0,
      major: "",
      avatar: "",
      buildcode: "",
      description: "",
      friendlist: []
    };

    return {
      setOtherInfo: function (info) {
        userData = {
           id: info.$id,
          name: info.name,
          email: info.email,
          birthday: info.birthday,
          points: info.points,
          eventCount: info.eventCount,
          surveyCount: info.surveyCount,
          major: info.major,
          avatar: info.avatar,
          buildcode: info.buildcode,
          description: info.description,
          friendlist: info.friendlist
        };
        return true;
      },

      getOtherInfo: function () {
        return userData;
      }
    };

  }])


   .factory('ProfilePress', [function () {
    var aprofile = false;

    return {
      setState: function (info) {
        aprofile = info;
        return true;
      },

      getState: function () {
        return aprofile;
      }
    };

  }])


.factory('geoPos', [function () {

    var myloc, watchId;
    
    watchId = navigator.geolocation.watchPosition(function(position)
          {
            var latlng = position.coords.latitude + "," + position.coords.longitude;
                console.log("Latlng under ionic platform: " + latlng);

                //------- CONTINOUSLY UPDATE USER'S LOCATION --------------

                myloc = latlng;  //actual current location
          });
   
    


  


    return {
     
      updateFirebase: function(usrID)
      {
        var userRef = firebase.database().ref("users").child(usrID);
          var obj = {
            location: myloc
          };
          userRef.update(obj);
      },
      getUserPosition: function () 
      {
        return myloc;
      }
    };

  }])


.factory('chatFactory', ['$firebaseArray',function ($firebaseArray) {

    var ref = firebase.database().ref("Chats");
    var chatData = $firebaseArray(ref);
    var myChatLists = [];
    var ready = false;
    chatData.$loaded(function(x)
    {
      //console.log("Chats Loaded",x);
      ready = true;
      
        
    });

    return {

      checkReady: function()
      {
        return ready;
      },
     
      /*getChats: function(usrID)
      {
        myChatLists = [];
        for(var i in chatData){
          for(var j in chatData[i].ids){
            if(chatData[i].ids[j].id == usrID){
              var quals = false;
              for(var k in myChatLists){
                if(myChatLists[k] == chatData[i].$id){
                  //console.log("same", myChatLists[k],chatData[i].$id);
                  quals = true;
                }
              }
              if(quals == false){
                 myChatLists.push(chatData[i].$id);
              }            
            }
          }
        }
        return myChatLists;
      },*/

      loadChatData: function (chatKey) 
      {
        return chatData.$getRecord(chatKey);
      },

      getChatData: function()
      {
        return chatData;
      } 
    };

  }])


.factory('backcallFactory', ['$state','$ionicPlatform','$ionicHistory','$timeout',
  function($state,$ionicPlatform,$ionicHistory,$timeout){
 
var obj={};
    obj.backcallfun=function(){
    var backbutton=0;
       $ionicPlatform.registerBackButtonAction(function () {
          if ($state.current.name == "tabsController.actionList") {
      
      if(backbutton==0){
            backbutton++;
              window.plugins.toast.showShortCenter('Press again to exit');
            $timeout(function(){backbutton=0;},5000);
        }else{
            navigator.app.exitApp();
        }
      
      }else{
            $ionicHistory.nextViewOptions({
                 disableBack: true
                });
        $state.go('tabsController.actionList');
        //go to home page
     }
        }, 100);//registerBackButton
};//backcallfun
return obj;
}])


  .service('BlankService', [function () {

  }]);
