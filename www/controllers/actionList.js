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
      $scope.photos = []
      var friendsRef = firebase.database().ref("users/");

      friendsRef.on("value", function(snapshot){
        var friendsTable  = snapshot.child(currentUser.uid+"/friendsinapp").val().data;
        console.log(friendsTable);

        for (var i = 0; i < friendsTable.length; i++){
          $scope.friends.push(friendsTable[i]);

          //FIND USER IN THE TABLE WHO HAS FB ID SIMILAR TO CURRENT USER'S FRIEND FBID
          friendsRef.orderByChild("fbid").equalTo(friendsTable[i].id).on("child_added", function(snap) {
            // $scope.photos.push(snap.val().photoURL);
            friendsTable[i].photo = snap.val().photoURL; 

          });
        }


      });
    }
  }])
