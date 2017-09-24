app.controller('joinListCtrl', ['$scope', '$state', '$firebaseArray', '$firebaseObject',
  function ($scope, $state, $firebaseArray, $firebaseObject) {

    //--------- PRESET SOME VARIBALES---------
    $scope.create = true;
    $scope.errorMessage = ""





    //--------- CHECK IF USER IS LOG IN ---------
    firebase.auth().onAuthStateChanged(function(user){
      if (user){
        $scope.currentUser = user;
      }


      //------- DELETE AN ACTION -----------------
      $scope.deleteAction = function(x){
        var activitiesRef = firebase.database().ref("users/" + $scope.currentUser.uid + "/actions/myActions");
        activitiesRef.child(x).remove();
        console.log("Successfully delete event");

      }

      //------- EDIT AN ACTION -------------------




    //--------------------------- ACTION THAT YOU HAVE CREATE WILL BE CAPTURE HERE --------------------
    var actionRef = firebase.database().ref("users/" + $scope.currentUser.uid + "/actions");
    actionRef.on("value", function(snapshot){
      var createAction = snapshot.val().myActions;
      var joinActions = snapshot.val().joinActions;
      if (createAction == undefined){
        $scope.errorMessage = "You have not creatd any action";
      }
      if (joinActions == undefined){
        $scope.errorMessage2 = "You have not joined any action";
      }
      else{
      $scope.errorMessage = "";
      $scope.myEventID = []
      $scope.myEvents = []
      $scope.photos = []

      $scope.joinEventID = []
      $scope.joinEvents = []
      $scope.photos2 = []

      for (var key in createAction){
        $scope.myEventID.push(key)
      }
      for (var key2 in joinActions){
        $scope.joinEventID.push(key2)
      }

      var activitiesRef = firebase.database().ref("activities/");
      activitiesRef.on("value", function(activitySnap){
        var activityTable = activitySnap.val();

        //-------------------- ACTIVITY TABLE ----------------------
        for (var i = 0; i < $scope.myEventID.length; i++){
            if (activityTable.hasOwnProperty($scope.myEventID[i])){
              $scope.myEvents.push(activityTable[$scope.myEventID[i]]);
            }
            if (activityTable.hasOwnProperty($scope.joinEventID[i])){
              $scope.joinEvents.push(activityTable[$scope.joinEventID[i]]);
            }
        }
          console.log("List of created events");
          console.log($scope.myEvents);
          console.log("List of joined events");
          console.log($scope.joinEvents)
        })
      }
    })
  })
}]);
