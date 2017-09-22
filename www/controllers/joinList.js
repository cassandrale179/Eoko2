app.controller('joinListCtrl', ['$scope', '$state', '$firebaseArray', '$firebaseObject',
  function ($scope, $state, $firebaseArray, $firebaseObject) {
  firebase.auth().onAuthStateChanged(function(user){
    if (user){
      $scope.currentUser = user;
    }

    var actionRef = firebase.database().ref("users/" + "0X1d3eosD8MyaUyvd8B5e92fiVo2/" + "actions/myActions");
    actionRef.on("value", function(snapshot){
      var actionList = snapshot.val();

      //--------- IF USER HASN'T CREATE AN EVENT YET, OUTPUT THAT THEY HAVE NOT CREATE ANY EVENT
      if (actionList == undefined){
        console.log("You have not created any event yet");
      }

      //-------- IF USER HAS CREATE AN EVENT, THEN PUSH IT TO THE EVENT LIST ----------
      else{
        $scope.myEventID = []
        $scope.myEvents = []
        for (var key in actionList){
          $scope.myEventID.push(key)
        }


        //------ LOOP THROUGH THE ALL THE EVENTS AND EXTRACT EVENT I CREATE ------------
        var activitiesRef = firebase.database().ref("activities/");
        activitiesRef.on("value", function(snapshot){
          var activityTable = snapshot.val()
          for (var i = 0; i < $scope.myEventID.length; i++){
            if (activityTable.hasOwnProperty($scope.myEventID[i])){
              $scope.myEvents.push(activityTable[$scope.myEventID[i]]);
            }
          }
        })
      }
    })
  })

  }]);
