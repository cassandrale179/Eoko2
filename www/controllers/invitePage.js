app.controller('invitePageCtrl', ['$scope', '$state', '$firebaseAuth',
function($scope, $state, $firebaseAuth){

  //----------------- LIST OF ARRAYS TO BE USED BY THIS CONTROLLER --------------
  $scope.userFriendObject = []
  $scope.splitArr = []
  $scope.invitedPeople = []
  var newArr = []


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
        if (className == "opaque activated"){
          document.getElementById(id).className = "not-opaque activated";
          $scope.invitedPeople.push(id);
        }
        if (className == "not-opaque activated"){
          document.getElementById(id).className = "opaque activated";
          toDeleteIndex = $scope.invitedPeople.indexOf(id);
          $scope.invitedPeople.splice(toDeleteIndex,1);
        }
      }


      //---------------------- WHEN USER SUBMIT AN INVITATION -----------------------
      $scope.invitedSubmit = function(){
        console.log($scope.invitedPeople);
      }


    })

  });



}])
