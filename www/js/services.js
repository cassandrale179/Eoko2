angular.module('eoko.services', [])

/* ------------------------------- FACEBOOK FACTORY --------------------------- */
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

                    var obj = {
                    name: snapshot.val().name,
                    photoURL: snapshot.val().photoURL 
                  }

                  userFriendsRef.child(friendID).update(obj);


                  // userFriendsRef.update(obj + friendID);
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


    };

    return facebookService;

  }])

/* ------------------------------- USER INFO FACTORY --------------------------- */
  .factory('UserInfo', [function() {
    var user;

    var UserInfo = {

      //fields: what you want e.g. [birthday, photoURL, name] etc.
      //THis will then be stored in UserInfo.user;
      getInfo: function(firebaseUser) {
        console.log("firebase User", firebaseUser);
        var ref = firebase.database().ref('users/'+firebaseUser.uid);
        var promise = ref.once("value");
        Promise.all([promise]).then(function(response){
          this.user = response[0].val();
          console.log("service user: ", this.user)
          return this.user;
        })
        // ref.on("value", function(snapshot){
        //   for (var i = 0; i<fields.length;i++){
        //     user[fields[i]] = snapshot.child(fields[i]).val();
        //     console.log("Got the user's " + fields[i]);
        //   }
        //
        // })

      },

      getUser: function(promise) {


      }
    };

    return UserInfo;
  }])


/* ------------------------------- OTHER INFO FACTORY --------------------------- */
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

/* ------------------------------- PROFILE PRESS FACTORY --------------------------- */
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


/* ------------------------------- GEO POS FACTORY --------------------------- */
.factory('geoPos', [function () {

    var myloc, watchId,uid;
    var ready = false;
    watchId = navigator.geolocation.watchPosition(function(position)
          {
            var latlng = position.coords.latitude + "," + position.coords.longitude;
                console.log("Latlng under ionic platform: " + latlng);

                //------- CONTINOUSLY UPDATE USER'S LOCATION --------------

                myloc = latlng;  //actual current location

                 firebase.auth().onAuthStateChanged(function(user){
                  if (user){
                    uid = user.uid;
                    var userRef = firebase.database().ref("users").child(user.uid);
                    var obj = {
                      location: myloc
                    };
                    console.log("we did it");
                    userRef.update(obj);
                    ready = true;
                  }
                });

                 if(uid)
                 {
                  var userRef = firebase.database().ref("users").child(uid);
                    var obj = {
                      location: myloc
                    };
                    console.log("we did it");
                    userRef.update(obj);
                    ready = true;
                 }
          });

    return {

      isReady: function()
      {
        return ready;
      },
      getUserPosition: function ()
      {
        return myloc;
      }
    };

  }])


.filter('orderObjectBy', [function(){
 return function(input, attribute) {
    if (!angular.isObject(input)) return input;

    var array = [];
    for(var objectKey in input) {
        array.push(input[objectKey]);
    }

    array.sort(function(a, b){
        a = parseInt(a[attribute]);
        b = parseInt(b[attribute]);
        return a - b;
    });
    return array;
 };
}])


 .directive('selectOnClick', ['$window', function ($window) {
    // Linker function
    return function (scope, element, attrs) {
      element.bind('click', function () {
        if (!$window.getSelection().toString()) {
          this.setSelectionRange(0, this.value.length);
        }
      });
    };
  }])




/* ---------------------------------- CHAT FACTORY ------------------------------- */
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


/* ------------------------------- BACK CALL FACTORY --------------------------- */
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
