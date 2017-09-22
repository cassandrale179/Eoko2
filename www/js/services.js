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
  var myloc = "location has not been found";
  return {
    updateFirebase: function(usrID) {
        return navigator.geolocation.watchPosition(onSuccess, onError);
        function onSuccess(position){
           var latlng = position.coords.latitude + "," + position.coords.longitude;
           console.log("Latlng under ionic platform: " + latlng);

           //------- CONTINOUSLY UPDATE USER'S LOCATION --------------

           myloc = latlng;  //actual current location
           console.log('myloc', myloc);



           var userRef = firebase.database().ref("users").child(usrID);
             var obj = {
               location: myloc
             };
           userRef.update(obj);
           return myloc;
       };
       function onError(error) {
          console.log('error getting location', error);
      };
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
      console.log("Chats Loaded",x);
      ready = true;


    });




    return {

      checkReady: function()
      {
        return ready;
      },

      getChats: function(usrID)
      {
        angular.forEach(chatData, function(value,key)
        {
          for(var i in value.ids)
          {
            if(value.ids[i].id == usrID)
            {
              myChatLists.push(value.$id);
              break;
            }
          }

        },chatData);
        return myChatLists;
      },

      loadChatData: function (chatKey)
      {
        return chatData.$getRecord(chatKey);
      }
    };

  }])


  .service('BlankService', [function () {

  }]);
