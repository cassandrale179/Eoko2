app.controller('actionCreateCtrl', ['$scope', '$state','$firebaseArray', '$ionicPlatform', '$http', '$window', 'ngFB',
  function ($scope, $state, $firebaseArray, $ionicPlatform, $http, $window, ngFB) {

    //------ CHECK IF USER IS CURRENTLY LOGGING IN ------
    var currentUser;

    firebase.auth().onAuthStateChanged(function(user) {
      if (user){
        console.log("user is logged in." + user.uid);
        currentUser = user;
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
              }

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
                })

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



        // console.log(facebookService.getUserInfo());


        // openFB.getLoginStatus(function(response){
        //   if (response.status=="connected"){
        //     console.log("response",  response.status);
        //     openFB.api({
        //       path: '/me',
        //       params: {fields: 'id, name,email, friends'},
        //     success: function(res){
        //       console.log("Success!");
        //       console.log(res.email);
        //     },
        //     error: function(error){
        //       console.log("Error while using open FB");
        //       console.log(error);
        //     }});
        //   }
        // })

        // $scope.getUserInfo();
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
        var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "&sensor=false";
        $http.get(url).then(function(response){
          $scope.action.location = response.data.results[0].formatted_address;
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


    // ------------ WHEN USER CLICK SUBMIT, THIS FUNCTION WILL HAPPEN --------
    $scope.submit = function(){
      var ref = firebase.database().ref('activities');
      console.log($scope.action);
    }


  }])
