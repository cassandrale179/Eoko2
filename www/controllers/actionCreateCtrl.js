app.controller('actionCreateCtrl', ['$scope', '$state','$firebaseArray', '$http', '$window', 'ngFB','geoPos','$timeout',
  function ($scope, $state, $firebaseArray, $http, $window, ngFB, geoPos, $timeout) {


    //------- AUTOCOMPLETE LOCATION ----------
    var input = document.getElementById('pac-input');
    var autocomplete = new google.maps.places.Autocomplete(input);

    var d = new Date();
    var hour = (d.getHours() < 10) ? '0' + d.getHours() : d.getHours();
    var minute = (d.getMinutes() < 10) ? '0' + d.getMinutes() : d.getMinutes();


    $scope.action = {
      'startTime': new Date(1970, 0, 1, hour, minute, 0)
    };

    //--------TAGS -------------------------------------
    var tagsRef = firebase.database().ref('actions');
    $scope.tagsArray = $firebaseArray(tagsRef);
    $scope.tagsArray.$loaded(function(arr){
    });

    clicked = {
        "background": "rgba(230, 126, 34, 0.9)",
        "color": "white"
      };
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

    };

    $scope.setStyle = function(tag) {
      if ($scope.selectedTags.indexOf(tag)==-1){
        return unclicked;
      }
      else {
        return clicked;
      }
    };

//------ CHECK IF USER IS CURRENTLY LOGGING IN ------
    firebase.auth().onAuthStateChanged(function(user) {
      if (user){
        console.log("user is logged in." + user.uid);
        $scope.currentUser = user;
        $scope.action.photoURL = user.photoURL;

        console.log("photo URL acquired: ", $scope.action.photoURL);
        startLoop();
      }
    });

    function startLoop()
    {
       if(geoPos.isReady() == false)
       {
        console.log("geoLoc not ready Yet");
        $timeout(function(){
                startLoop();
              },1000);
       }
       else
       {
         $scope.action.location = geoPos.getUserPosition();
         var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + $scope.action.location + "&sensor=false";
          $http.get(url).then(function(response){
            console.log("Google maps response", response);
            $scope.action.address = response.data.results[0].formatted_address;
          });
       }
     }


    // ------------ THIS ALLOW USER TO MOVE BETWEEN TWO DIFFERENT SCREENS ON CREATE ACTION PAGE  --------
    $scope.description = 0;
    $scope.privSelect = 'public';
    //------------- THIS ALLOW USER TO SET PRIVACY OF ACTION ---------------------
    $scope.setPrivacy = function(privacy) {



      if (privacy == "public")
      {
        $scope.publicStyle = clicked;
        $scope.privateStyle = unclicked;
        $scope.privSelect = 'public';
      }

      if (privacy == "private")
      {
        $scope.privateStyle = clicked;
        $scope.publicStyle = unclicked;
        $scope.privSelect = 'private';
      }
      $scope.action.privacy = privacy;


    };

    // ------------ WHEN USER CLICK SUBMIT, THIS FUNCTION WILL HAPPEN --------
    $scope.submit = function(){
      //Store the tags
      $scope.action.tags = "";
      for (var i = 0; i<$scope.selectedTags.length; i++){
        $scope.action.tags+=$scope.selectedTags[i].$value;
      }
      console.log($scope.action.tags);
      console.log("current user uid: ", $scope.currentUser.uid);
      var activitiesRef = firebase.database().ref('activities');
      var userActionsRef = firebase.database().ref('users/' + $scope.currentUser.uid + '/actions/myActions');


      //List of friends for private Events
      var friendsRef = firebase.database().ref('users/' + $scope.currentUser.uid + '/friends');
      var friendsArray = $firebaseArray(friendsRef);

      //Submit the event and get the event ID
      eventRef = activitiesRef.push($scope.action);
      eventID = eventRef.key;

      //Push the event under the user database
      var event = {
        eventID: eventID,
        location: $scope.action.location
      };

      userActionsRef.child(eventID).update(event);

      if ($scope.action.privacy == "public")
      {
        console.log($scope.action);
        $state.go('eventList');
        //Push event into firebase

       
      }

      if ($scope.action.privacy == "private")
      {
        console.log($scope.action);
        friendsArray.$loaded(function(friendsArray){
          console.log(friendsArray);
          angular.forEach(friendsArray, function(friend){
            console.log("friend ID:", friend.$id);
            var ref = firebase.database().ref('users/' + friend.$id + '/actions/friendActions');

            ref.child(eventID).update(event);

          });
        $state.go('eventList');
        });

      }

    };


  }])
