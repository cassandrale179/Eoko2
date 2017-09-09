angular.module('eoko.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})


.controller('LoginPageCtrl', function($scope, $firebaseObject) {

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