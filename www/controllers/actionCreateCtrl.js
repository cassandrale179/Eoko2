app.controller('actionCreateCtrl', ['$scope', '$state','$firebaseArray', '$ionicPlatform', '$http', '$window', 'ngFB',
  function ($scope, $state, $firebaseArray, $ionicPlatform, $http, $window, ngFB) {

    //------ CHECK IF USER IS CURRENTLY LOGGING IN ------
    var currentUser = firebase.auth().currentUser;
    $scope.action = {};


    //--------TAGS -------------------------------------
    var tagsRef = firebase.database().ref('actions');
    $scope.tagsArray = $firebaseArray(tagsRef);
    $scope.tagsArray.$loaded(function(arr){
    })

    clicked = {"background": "rgba(230, 126, 34, 0.9)", "color": "white"};
    unclicked = {};

    $scope.publicStyle = clicked;
    $scope.action.privacy = 'public';


    $scope.selectedTags = [];
    $scope.addTag = function(tag) {
      var index = $scope.selectedTags.indexOf(tag);
      if (index!=-1){
        $scope.selectedTags.splice(index, 1);
      }
      else{
        $scope.selectedTags.push(tag);
      }
      console.log($scope.selectedTags);

    }

    $scope.setStyle = function(tag) {
      if ($scope.selectedTags.indexOf(tag)==-1){
        return unclicked;
      }
      else {
        return clicked;
      }
    }


    firebase.auth().onAuthStateChanged(function(user) {
      if (user){
        console.log("user is logged in." + user.uid);
        currentUser = user;
        $scope.action.userID = user.uid;
        var ref = firebase.database().ref('users/'+user.uid);

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
              // userFriendsRef.update(friendsList);




            },
            error: function(error){
              console.log("Error while using open FB");
              console.log(error);
            }});
          }
        });

      }
      else{
        console.log("No user")
      }
    })


    //------------------- GET USER CURRENT LOCATION --------------------------------------
    $ionicPlatform.ready(function(){
      var watchId = navigator.geolocation.watchPosition(onSuccess);
      function onSuccess(position) {
        var latlng = position.coords.latitude + "," + position.coords.longitude;
        $scope.action.location = latlng;
        var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "&sensor=false";
        $http.get(url).then(function(response){
          $scope.action.address = response.data.results[0].formatted_address;
        });

        //UPDATE USER'S LOCATION ON FIREBASE
        var obj = {
          location: latlng
        }
      }

    })


    // ------------ THIS ALLOW USER TO MOVE BETWEEN TWO DIFFERENT SCREENS ON CREATE ACTION PAGE  --------
    $scope.description = 0;
    $scope.action={};


    //------------- THIS ALLOW USER TO SET PRIVACY OF ACTION ---------------------
    $scope.setPrivacy = function(privacy) {



      if (privacy == "public")
      {
        $scope.publicStyle = clicked;
        $scope.privateStyle = unclicked;
      }

      if (privacy == "private")
      {
        $scope.privateStyle = clicked;
        $scope.publicStyle = unclicked;
      }
      $scope.action.privacy = privacy;


    }

    // ------------ WHEN USER CLICK SUBMIT, THIS FUNCTION WILL HAPPEN --------
    $scope.submit = function(){
      //Store the tags
      $scope.action.tags = "";
      for (var i = 0; i<$scope.selectedTags; i++){
        $scope.action.tags+=$scope.selectedTags[i];
      }
      console.log($scope.action.tags);
      console.log("current user uid: ", currentUser.uid);
      var activitiesRef = firebase.database().ref('activities');
      var userActionsRef = firebase.database().ref('users/' + currentUser.uid + '/actions/myActions');


      //List of friends for private Events
      var friendsRef = firebase.database().ref('users/' + currentUser.uid + '/friends');
      var friendsArray = $firebaseArray(friendsRef);

      //Submit the event and get the event ID
      eventRef = activitiesRef.push($scope.action);
      eventID = eventRef.key;

      //Push the event under the user database
      var obj = {};
      obj[eventID] = $scope.action.location;
      userActionsRef.update(obj)

      if ($scope.action.privacy == "public")
      {
        console.log($scope.action);
        $state.go('eventList');
        //Push event into firebase

        ;
      }

      if ($scope.action.privacy == "private")
      {
        console.log($scope.action);
        friendsArray.$loaded(function(friendsArray){
          console.log(friendsArray);
          angular.forEach(friendsArray, function(friend){
            console.log("friend ID:", friend.$id);
            var ref = firebase.database().ref('users/' + friend.$id + '/actions/friendActions');
            var obj = {};
            obj[eventID] = $scope.action.location;
            ref.update(obj);

          })
          $state.go('eventList');
        })

      }

    }


  }])
