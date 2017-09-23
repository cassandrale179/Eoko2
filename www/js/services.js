angular.module('eoko.services', [])


  .factory('facebookService', [function () {
    var facebookService = {
      getUserInfo: function(user){

        //Get user info
        //TODO: put this in action List page
        openFB.getLoginStatus(function(response){
          if (response.status=="connected"){
            console.log("response",  response.status);
            openFB.api({
              path: '/me',
              params: {fields: 'id, name, gender, picture, birthday, friends'},
            success: function(res){
              console.log("Success!");
              var userInfo = {
                fbid: res.id,
                name: res.name,
                gender: res.gender,
                photoURL: res.picture.data.url,
                birthday: res.birthday
              };

              //Get firebase ID of friends who are in app
              var ref = firebase.database().ref("users");
              var friendsList = {};

              userFriendsRef = firebase.database().ref('users/'+user.uid+"/friends");
              angular.forEach(res.friends.data, function(friend){
                var friendID = friend.id;
                console.log(friendID);
                ref.orderByChild('fbid').equalTo(friendID).on("child_added", function(snapshot){
                  var obj = {};
                  obj[snapshot.key] = snapshot.val().name;

                  userFriendsRef.update(obj);
                });

              });


              //Update all info to Firebase
              console.log("user info");
              console.log('friends list', friendsList);
              console.log(userInfo);
              userRef = firebase.database().ref('users/'+user.uid);

              userRef.update(userInfo);
              console.log("friends list below");
              console.log(friendsList);

              console.log("Finished getting user info!!!");
              // userFriendsRef.update(friendsList);

            },
            error: function(error){
              console.log("Error while using open FB");
              console.log(error);
            }});
          }
        });
      }


    }

    return facebookService;

  }])

  .factory('UserInfo', [function() {
    var user = {};

    var UserInfo = {

      //fields: what you want e.g. [birthday, photoURL, name] etc.
      //THis will then be stored in UserInfo.user;
      getInfo: function(firebaseUser, fields) {
        var ref = firebase.database().ref('users/'+firebaseUser.uid);

        ref.on("value", function(snapshot){
          for (var i = 0; i<fields.length;i++){
            user[fields[i]] = snapshot.child(fields[i]).val();
            console.log("Got the user's " + fields[i]);
          }

        })

      },

      getUser: function() {
        return user;
      }
    };

    return UserInfo;
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

  .service('BlankService', [function () {

  }]);
