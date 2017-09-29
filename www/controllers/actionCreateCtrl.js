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
    $scope.action.privacy = 'public';


    $scope.selectTagList = [];
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
          },
          function(err)
          {
            console.log("Problem is probably CORS", err);
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
      $scope.action.tags = $scope.selectTagList;
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
          $scope.action.address = place.formatted_address;
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
              var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
              });
              $scope.autocomplete.setBounds(circle.getBounds());
            });
          }
        };

  }])
