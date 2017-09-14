app.controller('actionListCtrl', ['$scope', '$state','$firebaseArray',

  function ($scope, $state, $firebaseArray) {

    //GET THE CURRENT USER WHO ARE USING THE APP
    var currentUser;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        currentUser = user;
    }
    console.log(currentUser.uid);
      getFriends();
    });


    //GET THE CURRENT USER'S FRIEND LIST
    function getFriends()
    {
      $scope.friends =  []
      var friendsRef = firebase.database().ref("users/" + currentUser.uid + "/friendsinapp");
      friendsRef.once("value", function(snapshot){
        var friendsTable  = snapshot.val().data;
        console.log(friendsTable);
        for (var i = 0; i < friendsTable.length; i++){
          $scope.friends.push(friendsTable[i]);
        }
      });
    }




  }])
