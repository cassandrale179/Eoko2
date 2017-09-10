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


/*
var ref = firebase.database().ref();

var obj = $firebaseObject(ref);

// For three-way data bindings, bind it to the scope instead
obj.$bindTo($scope, "data");
*/ 

//Old version
// app.controller('loginCtrl', ['$scope', '$stateParams', '$state', 'UserInfo', '$ionicPopup',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// // You can include any angular dependencies as parameters for this function
// // TIP: Access Route Parameters for your page via $stateParams.parameterName
//     function ($scope, $stateParams, $state, UserInfo, $ionicPopup) {
//
//
//       $scope.user = {email: "", password: ""};
//
//       $scope.loginUser = function () {
//         firebase.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password).then
//         (function (resolve) {
//             console.log("logged in!");
//             var usr = firebase.auth().currentUser;
//             var ref = firebase.database().ref("Buildings").child(usr.displayName + "/Users");
//
//             ref.child(usr.uid).once("value").then(function (snapshot) {
//               console.log(snapshot.val());
//               UserInfo.setUserInfo(snapshot.val());
//               $state.go('tabsController.events');
//             });
//
//           },
//           function (error) {
//             showAlert(error.message);
//             console.log(error);
//           });
//       };
//
//       $scope.blurry = {behind: "0px"};
//
//       //alert for wrong credential
//       function showAlert(message) {
//         $scope.blurry = {behind: "5px"};
//
//         var alertPopup = $ionicPopup.alert({
//           title: 'Login Error',
//           cssClass: 'eoko-alert-pop-up',
//           template: message
//         });
//         alertPopup.then(function(res) {
//           $scope.blurry = {behind: "0px"};
//           console.log('Invalid username/password logging!');
//         });
//       }
//
//       window.addEventListener('native.keyboardshow', keyboardShowHandler);
//
//       function keyboardShowHandler(e){
//          //showAlert('Keyboard height is: ' + e.keyboardHeight);
//           //alert('Keyboard height is: ' + e.keyboardHeight);
//       }
//
//
//     }])
