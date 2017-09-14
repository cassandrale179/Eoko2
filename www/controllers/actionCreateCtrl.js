app.controller('actionCreateCtrl', ['$scope', '$state','$firebaseArray',

  function ($scope, $state, $firebaseArray) {

    // ------------ THIS ALLOW USER TO MOVE BETWEEN TWO DIFFERENT SCREENS ON CREATE ACTION PAGE  --------
    $scope.description = 0;
    $scope.action={};
    var currentUser;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        currentUser = user;
        $scope.action.owner = currentUser.uid;
    }
    });



    // ------------ WHEN USER CLICK SUBMIT, THIS FUNCTION WILL HAPPEN --------
    $scope.submit = function(){
        var eventRef = firebase.database().ref("activities");
        eventRef.push($scope.action);
        console.log("Successfully pushed");
    }






  }])
