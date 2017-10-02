app.controller('invitePageCtrl', ['$scope', '$state', '$firebaseAuth',
function($scope, $state, $firebaseAuth){
  $scope.userFriendObject = []

  //start the thing in case it starts here
  firebase.auth().onAuthStateChanged(function(user){
    if (user){
      $scope.currentUser = user;
    }

    //---------- EXTRACT FRIEND LIST OF THE AUTHOR -----------
    var friendsRef = firebase.database().ref("users/" + $scope.currentUser.uid + "/friends");
    friendsRef.on("value", function(snapshot){
      var friendTable = snapshot.val();
      for (var key in friendTable){
        var userObj = friendTable[key]
        userObj.id = key;
        $scope.userFriendObject.push(userObj);
      }
      console.log("This is a list of friends");
      console.log($scope.userFriendObject);


      //------ CHECK THE LIST PARTICIPANT OF THE EVENT---------

    })

  });



}])
