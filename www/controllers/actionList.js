app.controller('actionListCtrl', ['$scope', '$state','$firebaseArray', '$http', '$ionicPlatform',

  function ($scope, $state, $firebaseArray, $http, $ionicPlatform) {

    //GET THE CURRENT USER WHO ARE USING THE APP
    var currentUser;
    $scope.nudge = 0
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        currentUser = user;
    }
    console.log(currentUser.uid);
      getFriends();
      ionicPlatform();
    });


    //GET THE CURRENT USER'S FRIEND LIST
    function getFriends()
    {
      $scope.friends =  []
      $scope.photos = []
      var friendsRef = firebase.database().ref("users/");
      friendsRef.on("value", function(snapshot){

        //GET CURRENT USER'S INFORMATION (NAME AND PHOTO)
        var userInfo = snapshot.child(currentUser.uid).val();
        $scope.userPictureURL = userInfo.photoURL;
        $scope.userName = userInfo.name;

        //GET USER FRIEND'S INFORMATION UNDER THE USER'S SNAPSHOT
        var friendsTable  = snapshot.child(currentUser.uid+"/friendsinapp").val().data;
        console.log(friendsTable);

        //CREATING A USER OBJECT FOR THE FRIENDS
        for (var i = 0; i < friendsTable.length; i++){
          $scope.friends.push(friendsTable[i]);

          //FIND USER IN THE TABLE WHO HAS FB ID SIMILAR TO CURRENT USER'S FRIEND FBID
          friendsRef.orderByChild("fbid").equalTo(friendsTable[i].id).on("child_added", function(snap) {
            friendsTable[i].photo = snap.val().photoURL;
            friendsTable[i].location = snap.val().location;
            friendsTable[i].distance = snap.val().distance;
            friendsTable[i].uid = snap.key;
          });
        }
      });
    }




    //--------------------- REVERSE GEO-ENCODING ------------------------------
    function reverseGeo(geocoder){
      var latlng = "39.9551991,-75.1885332";
      var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "&sensor=false";
      $http.get(url).then(function(response){
        console.log("Formatted Address: " + response.data.results[0].formatted_address);
      });
    }

    //--------------------- ALWAYS WATCHING USER MOVEMENT AND PUSH IT TO FIREBASE ------
    function ionicPlatform(){
      $ionicPlatform.ready(function(){
        var watchId = navigator.geolocation.watchPosition(onSuccess);
        function onSuccess(position) {
          var latlng = position.coords.latitude + "," + position.coords.longitude;
          console.log("Latlng under ionic platform: " + latlng);

          //------- CONTINOUSLY UPDATE USER'S LOCATION --------------
          var userRef = firebase.database().ref("users/" + currentUser.uid);
          var obj = {
            location: latlng
          }
          userRef.update(obj);



          //------- GET USER'S CURRENT LOCATION ---------------
          var lat1 = position.coords.latitude;
          var lon1 = position.coords.longitude;


          //-------- LOOP THROUGH THE FRIEND'S TABLE AND GET THEIR LOCATION -------
          var earthRadius = 6371;
          console.log("Calculating friend distance");
          for (var i = 0; i < $scope.friends.length; i++){
            var arr = $scope.friends[i].location.split(",");
            var lat2 = arr[0];
            var lon2 = arr[1];
            var dLat = deg2rad(lat2-lat1);  // deg2rad below
            var dLon = deg2rad(lon2-lon1);
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = earthRadius * c; // Distance in km
            var miles = d * 0.621371;
            console.log($scope.friends[i].uid + ": " + miles);
          }
        }
      });

      }

      function deg2rad(deg) {
        return deg * (Math.PI/180);
      }



  }])
