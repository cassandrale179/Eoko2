app.controller('actionCreateCtrl', ['$scope', '$state','$firebaseArray', '$http', '$window', 'ngFB','geoPos','$timeout','$firebaseObject','$ionicPopup',
  function ($scope, $state, $firebaseArray, $http, $window, ngFB, geoPos, $timeout, $firebaseObject,$ionicPopup) {


    //------- AUTOCOMPLETE LOCATION ----------
    var input = document.getElementById('pac-input');
    var autocomplete = new google.maps.places.Autocomplete(input);
      $scope.action = {};

      $scope.selectTagList = [];

       $scope.$on('$ionicView.afterEnter', function () //before anything runs
      {
        try
        {
          var d = new Date();
          var hour = (d.getHours() < 10) ? '0' + d.getHours() : d.getHours();
          var minute = (d.getMinutes() < 10) ? '0' + d.getMinutes() : d.getMinutes();

          $scope.action.startTime = new Date(1970, 0, 1, hour, minute, 0);

          if($scope.tagSelect)
          {
            for(var i in $scope.tagSelect)
            {
              if($scope.tagSelect[i].$value != null)
              {
                console.log("fucking reset you ass, ", $scope.tagSelect[i]);
              $scope.selectionTag($scope.tagSelect[i].$value + 'create');
              }

            }
            $scope.selectTagList = [];
          }

          if(geoPos.isReady() == true)
        {
          $scope.action.address = '';
          initGeoLoc();
        }

          $scope.action.name = '';
          $scope.action.description = '';

          if($scope.currentUser && $scope.thisUser)
          {
            $scope.action.photoURL = $scope.currentUser.photoURL;
            $scope.setPrivacy($scope.thisUser.privacy);
          }


          }
        catch(err)
        {
          console.log("first time?", err);
        }
        //startLoop();
      });


    //--------TAGS -------------------------------------
    var tagsRef = firebase.database().ref('actions');
    $scope.tagSelect = $firebaseArray(tagsRef);
    $scope.tagSelect.$loaded(function(arr){
      console.log("taglist create", $scope.tagSelect);
    });

    clicked = {
        "background": "rgba(230, 126, 34, 0.9)",
        "color": "white"
      };
    unclicked = {};

    $scope.publicStyle = clicked;

    $scope.blurry = {behind: "0px"};
    function showAlert(message) {
        $scope.blurry = {behind: "5px"};

        var alertPopup = $ionicPopup.alert({
          title: 'Error',
          cssClass: 'eoko-alert-pop-up',
          template: message
        });
        alertPopup.then(function(res) {
          $scope.blurry = {behind: "0px"};
        });
      };

   // $scope.selectTagList = [];
      //select filter
      $scope.selectionTag = function (elementId)
      {
        console.log("started select");
      var elementClass = document.getElementById(elementId).className;
        if(elementClass == "eoko-horizontal-scroll-button eoko-text-thin activated" || elementClass == "eoko-horizontal-scroll-button eoko-text-thin ng-binding activated")
        {
          console.log("activated");
          document.getElementById(elementId).className = "eoko-horizontal-scroll-button-selected eoko-text-thin";
          $scope.selectTagList.push(elementId.replace(/create/,''));
        }else{
          console.log("not activated");
          document.getElementById(elementId).className = "eoko-horizontal-scroll-button eoko-text-thin";
          for(var i in $scope.selectTagList)
          {
            console.log("for loopin" , i);
            if($scope.selectTagList[i] == elementId.replace(/create/,''))
            {
              console.log("splicin");
                  $scope.selectTagList.splice(i, 1);
            }
          }
        }
        if($scope.selectTagList == [])
        {
          console.log("nuller than a null pointer");
          $scope.selectTagList = null;
        }
        console.log("searching",$scope.selectTagList);
        $timeout(function(){$scope.$apply();});
      };

//------ CHECK IF USER IS CURRENTLY LOGGING IN ------
    firebase.auth().onAuthStateChanged(function(user) {
      if (user){
        console.log("user is logged in." + user.uid);
        $scope.currentUser = user;
        $scope.action.photoURL = user.photoURL;

        var rel = firebase.database().ref('users').child(user.uid);
        $scope.thisUser = $firebaseObject(rel);
        $scope.thisUser.$loaded().then(function(suc)
        {
          $scope.setPrivacy($scope.thisUser.privacy);
        });

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
           initGeoLoc();
       }
     }

     function initGeoLoc()
     {
       $scope.action.location = geoPos.getUserPosition();
         var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + $scope.action.location +
          "&key=AIzaSyCxi6Eah3dgixKG8oFO8DB6sMVN1v3mxuQ";
          $http.get(url).then(function(response){
            console.log("Google maps response", response);
            $scope.action.address = response.data.results[0].formatted_address;
          },
          function(err)
          {
            console.log("Problem is probably CORS", err);
          });
     }

    // ------------ THIS ALLOW USER TO MOVE BETWEEN TWO DIFFERENT SCREENS ON CREATE ACTION PAGE  --------
    $scope.description = 0;
    //------------- THIS ALLOW USER TO SET PRIVACY OF ACTION ---------------------
    $scope.setPrivacy = function(privacy)
    {
      if (privacy == "public")
      {
        $scope.publicStyle = clicked;
        $scope.privateStyle = unclicked;
        $scope.inviteStyle = unclicked;
        $scope.privSelect = 'public';
      }

      if (privacy == "private")
      {
        $scope.privateStyle = clicked;
        $scope.publicStyle = unclicked;
        $scope.inviteStyle = unclicked;
        $scope.privSelect = 'private';
      }

      if (privacy == "invite")
      {
        $scope.privateStyle = unclicked;
        $scope.publicStyle = unclicked;
        $scope.inviteStyle = clicked;
        $scope.privSelect = 'invite';
      }
      $scope.action.privacy = privacy;
    };

    // ------------ WHEN USER CLICK SUBMIT, THIS FUNCTION WILL HAPPEN --------
    $scope.submit = function(){
      $scope.action.tags = $scope.selectTagList;

      if($scope.action.privacy == null || $scope.action.privacy == undefined
         || $scope.action.privacy == "" || $scope.action.privacy == " ")
      {
        showAlert("You must select public or private");
        return;
      }
      if($scope.action.name == null || $scope.action.name == undefined
         || $scope.action.name == "" || $scope.action.name == " ")
      {
        showAlert("You must create a title");
        return;
      }
      if($scope.action.tags == null || $scope.action.tags == undefined
         || $scope.action.tags == "" || $scope.action.tags == " ")
      {
        showAlert("You must press at least one tag");
        return;
      }
      if($scope.action.address == null || $scope.action.address == undefined
         || $scope.action.address == "" || $scope.action.address == " ")
      {
        showAlert("You must enter an address");
        return;
      }
      if($scope.action.startTime == null || $scope.action.startTime == undefined
         || $scope.action.startTime == "" || $scope.action.startTime == " ")
      {
        showAlert("You must enter a start time");
        return;
      }
      if($scope.action.description == null || $scope.action.description == undefined
         || $scope.action.description == "" || $scope.action.description == " ")
      {
        showAlert("You must enter a description");
        return;
      }


      //Store the tags

      console.log($scope.action.tags);
      console.log("current user uid: ", $scope.currentUser.uid);
      var activitiesRef = firebase.database().ref('activities');
      var userActionsRef = firebase.database().ref('users/' + $scope.currentUser.uid).child('actions/myActions');

      $scope.action.startTime = $scope.action.startTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
      console.log("new time",$scope.action.startTime);
      //List of friends for private Events
      var friendsRef = firebase.database().ref('users/' + $scope.currentUser.uid + '/friends');
      var friendsArray = $firebaseArray(friendsRef);

      //Create an event chat
      var chatsRef = firebase.database().ref('Chats/');
      var eventChatRef = chatsRef.push({
        name: $scope.action.name,
        photoURL: $scope.currentUser.photoURL
      });
      var eventChatID = {chatID: eventChatRef.key}
      chatsRef.child(eventChatID.chatID + '/ids').push({
        id: $scope.currentUser.uid,
        name: $scope.currentUser.displayName,
        avatar: $scope.currentUser.photoURL
      })

      //Submit the event and get the event ID
      $scope.action.chatID = eventChatID.chatID;
      $scope.action.ownerID = $scope.currentUser.uid;
      eventRef = activitiesRef.push($scope.action);
      eventID = eventRef.key;

      //Push the event under the user database
      var event = {
        eventID: eventID,
        location: $scope.action.location,
        time: $scope.action.startTime,
        name: $scope.action.name
      };

      userActionsRef.child(eventID).update(event);


      //Add chat id to the event creator (currentuser)
      var userChatRef = firebase.database().ref('users/' + $scope.currentUser.uid).child('chat');
      userChatRef.push(eventChatID);


      if ($scope.action.privacy == "public")
      {
        console.log($scope.action);
        $state.go('eventList');
        return;
        //Push event into firebase
      }

      else if ($scope.action.privacy == "private")
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
           return;
        });

      }

    };



//------------------------------google maps stuff-------------------
function initAutocomplete() {
          $scope.autocomplete = new google.maps.places.Autocomplete(
              (document.getElementById('autocomplete')),
              {types: ['geocode','establishment']});

          container = document.getElementsByClassName('pac-container');
            // disable ionic data tab
            angular.element(container).attr('data-tap-disabled', 'true');
            // leave input field if google-address-entry is selected
            angular.element(container).on("click", function(){
                document.getElementById('searchBar').blur();
            });

          $scope.autocomplete.addListener('place_changed', fillInAddress);
        }

        function fillInAddress() {
          var place = $scope.autocomplete.getPlace();
          console.log("THE FUCKING PLACE IS", place.geometry);
          $scope.action.address = place.formatted_address;

          var addr = place.formatted_address;
          addr = addr.replace(/,/g,'');
          addr = addr.replace(/ /g,'+');


         var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+ addr
         + "&key=AIzaSyCxi6Eah3dgixKG8oFO8DB6sMVN1v3mxuQ";

          $http.get(url).then(function(response){
            console.log("SHATTY GOOGLE MAPS", response);

            var lat = response.data.results[0].geometry.location.lat;
            var long = response.data.results[0].geometry.location.lng;

             $scope.action.location = lat + ', ' + long;
          },
          function(err)
          {
            console.log("Problem is probably CORS", err);
          });

        }


        container = document.getElementsByClassName('pac-container');
        // disable ionic data tab
        angular.element(container).attr('data-tap-disabled', 'true');
        // leave input field if google-address-entry is selected
        angular.element(container).on("click", function(){
            document.getElementById('searchBar').blur();
        });



        $scope.geolocate = function() {

            google.maps.event.addDomListener(window, 'load', initAutocomplete);
            initAutocomplete();



          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              console.log("long lat", lng, lat);
              var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
              });
              $scope.autocomplete.setBounds(circle.getBounds());
            });
          }
        };

  }])
