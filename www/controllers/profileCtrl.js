app.controller('profileCtrl', ['$scope', '$state','$firebaseArray',

  function ($scope, $state, $firebaseArray) {

    // ------------ THIS ALLOW USER TO MOVE BETWEEN TWO DIFFERENT SCREENS ON CREATE ACTION PAGE  --------
    $scope.description = 0;
    $scope.action={}; 



    // ------------ WHEN USER CLICK SUBMIT, THIS FUNCTION WILL HAPPEN --------
    $scope.submit = function(){
      var eventRef = firebase.database().ref("activities");
      eventRef.push($scope.action);
    }
  }])
