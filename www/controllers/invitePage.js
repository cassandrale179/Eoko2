app.controller('invitePageCtrl', ['$scope', '$state', '$firebaseAuth', '$stateParams', 'EventInfo',
function($scope, $state, $firebaseAuth, $stateParams, EventInfo){

  //----------------- LIST OF ARRAYS TO BE USED BY THIS CONTROLLER --------------
  $scope.userFriendObject = [];
  $scope.splitArr = [];
  $scope.invitedPeople = [];
  var newArr = [];
  console.log($scope.event);

  $scope.$on('$ionicView.beforeEnter', function () //before anything runs
  {
   $scope.event = EventInfo.getEventInfo();
  });

  //------------------- GET CURRENT USER UID -------------------
  firebase.auth().onAuthStateChanged(function(user){
    if (user){
      $scope.currentUser = user;
    }

    //------------------- EXTRACT FRIEND LIST OF THE AUTHOR -----------------
    var friendsRef = firebase.database().ref("users/" + $scope.currentUser.uid + "/friends");
    friendsRef.on("value", function(snapshot){
      var friendTable = snapshot.val();
      for (var key in friendTable){
        var userObj = friendTable[key]
        userObj.id = key;
        $scope.userFriendObject.push(userObj);
      }
      console.log($scope.userFriendObject);


      //---------------------- SPLIT ARRAY INTO CHUNKS -----------------------
      chunk = 3
      for (i=0,j=$scope.userFriendObject.length; i<j; i+=chunk) {
          temparray = $scope.userFriendObject.slice(i,i+chunk);
          $scope.splitArr.push(temparray);
      }
      console.log($scope.splitArr);


      //---------------------- WHEN USER CLICK INVITE FRIENDS  -----------------------
      $scope.inviteFriend = function(id){
        var className = document.getElementById(id).className;
        console.log("This is the id that is passed to inviteFriend");
        console.log(id);

        //------------ IF USER SELECT A PERSON, THEN CHANGE THE OPACITY --------------
        if (className == "opaque activated"){
          document.getElementById(id).className = "not-opaque activated";
          $scope.invitedPeople.push(id);
        }
        if (className == "not-opaque activated"){
          document.getElementById(id).className = "opaque activated";
          toDeleteIndex = $scope.invitedPeople.indexOf(id);
          $scope.invitedPeople.splice(toDeleteIndex,1);
        }
      };


      //---------------------- WHEN USER SUBMIT, EVENT ARE PUSHED UNDER THE FRIEND-----------------------
      $scope.invitedSubmit = function(invitedPeople2){
        for (var i = 0;  i < invitedPeople2.length; i++){
          console.log("invitedpeople2");
          console.log(invitedPeople2[i]);
          var inviteRef = firebase.database().ref("users/" + invitedPeople2[i] + "/actions/inviteActions");
          console.log("Invite process begin");
          inviteRef.child($scope.event.eventID).update($scope.event);
          console.log("This is the scope.event when it is passed");
          console.log($scope.event);
          console.log("Invite process done");
        }

        //----------------- DESELECT THE CSS ------------------
        for (var j = 0; j < $scope.invitedPeople.length; j++){
          document.getElementById($scope.invitedPeople[j]).className = "opaque activated";
        }

        //HARD RESET AN ARRAY
        while ($scope.invitedPeople.length > 0) {
          $scope.invitedPeople.pop();
        }
        console.log("Process reset array");
        console.log($scope.invitedPeople);
        $state.go('navController.notification');

      };
    })
  });
}])
