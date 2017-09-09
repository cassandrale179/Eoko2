app.controller('loginCtrl', function($scope, $firebaseObject) {
  console.log("login page!");

  var ref = firebase.database().ref();

  var obj = $firebaseObject(ref);

  // For three-way data bindings, bind it to the scope instead
  obj.$bindTo($scope, "data");


  // firebase.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(
  //   function(resolve){
  //     console.log("Logged in");
  //     var usr = firebase.auth().currentUser;
  //   });
});
