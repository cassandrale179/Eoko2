app.controller('actionListCtrl', ['$scope', '$state','$firebaseArray',

  function ($scope, $state, $firebaseArray) {

    /* ----------------- FACEBOOK FRIENDS WHO ACTUALLY USE THE APP --------------------- */
    // FB.api('/me/friends?limit=5000', function(res){
    //   if(!res || res.error){
    //     console.log('Error occured while fetching user details.');
    //   }
    //   else{
    //     console.log(res);
    //   }
    // })


    var currentUser = firebase.auth().currentUser;
    $scope.friends =  []
    // var friendsRef = firebase.database().ref("friends/" + currentUser.uid);
    var friendsRef = firebase.database().ref("friends/0X1d3eosD8MyaUyvd8B5e92fiVo2")
    friendsRef.once("value", function(snapshot){
      var friendsTable  = snapshot.val().data;
      for (var i = 0; i < friendsTable.length; i++){
        $scope.friends.push(friendsTable[i]);
      }
      console.log($scope.friends)
    });





  }])
