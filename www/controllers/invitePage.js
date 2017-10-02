app.controller('invitePageCtrl', ['$scope', '$state', '$firebaseAuth',
function($scope, $state, $firebaseAuth){
  $scope.userFriendObject = []
  $scope.splitArr = []
  var newArr = []

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
      console.log($scope.userFriendObject);


      //------ SPLIT ARRAY ---------
      chunk = 3
      for (i=0,j=$scope.userFriendObject.length; i<j; i+=chunk) {
          temparray = $scope.userFriendObject.slice(i,i+chunk);
          $scope.splitArr.push(temparray);
      }

      console.log($scope.splitArr);

    })

  });



}])
