app.controller('eventListCtrl', ['$scope', '$state','$firebaseArray', '$ionicPlatform', '$http',
  function ($scope, $state, $firebaseArray, $ionicPlatform, $http) {

    //-------------- GET THE CURRENT USER WHO ARE USING THE APP--------------
    var currentUser;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        currentUser = user;
    }
    console.log(currentUser.uid);
      getEvents();
    });


    //--------------------- GET ALL THE EVENTS OF THE USER -----------------
    function getEvents()
    {
      $scope.photos = [];
      var eventsRef = firebase.database().ref("activities/");
      $scope.events = $firebaseArray(eventsRef);
      $scope.events.$loaded().then(function(x) {
        console.log("Event List: ", $scope.events);
        angular.forEach($scope.events, function(event){
          var userRef = firebase.database().ref("users/" + event.userID);

        })
      });



    }



  }])
