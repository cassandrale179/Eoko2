app.controller('actionListCtrl', ['$scope', '$state','$firebaseArray', '$http',

  function ($scope, $state, $firebaseArray, $http) {

    //GET THE CURRENT USER WHO ARE USING THE APP
    var currentUser;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        currentUser = user;
    }
    console.log(currentUser.uid);
      getFriends();
      getLocation();
      reverseGeo();


    });


    //GET THE CURRENT USER'S FRIEND LIST
    function getFriends()
    {
      $scope.friends =  []
      $scope.photos = []
      var friendsRef = firebase.database().ref("users/");

      friendsRef.on("value", function(snapshot){
        var friendsTable  = snapshot.child(currentUser.uid+"/friendsinapp").val().data;
        console.log(friendsTable);

        for (var i = 0; i < friendsTable.length; i++){
          $scope.friends.push(friendsTable[i]);

          //FIND USER IN THE TABLE WHO HAS FB ID SIMILAR TO CURRENT USER'S FRIEND FBID
          friendsRef.orderByChild("fbid").equalTo(friendsTable[i].id).on("child_added", function(snap) {
            // $scope.photos.push(snap.val().photoURL);
            friendsTable[i].photo = snap.val().photoURL;
          });
        }
      });
    }


    //-------- GET CURRENT INFORMATION WITH GOOGLE MAPS -----------------------
    function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
  }

    function showPosition(position) {
      console.log("Latitude: " + position.coords.latitude +
      "Longitude: " + position.coords.longitude);
    }




    //--------- REVERSE GEO-ENCODING ------------------------------------------
    function reverseGeo(geocoder){


      var latlng = "39.9551991,-75.1885332";
      var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "&sensor=false";
      $http.get(url).then(function(response){
        console.log(response.data.results[0].formatted_address); 
      });


    }





  }])
