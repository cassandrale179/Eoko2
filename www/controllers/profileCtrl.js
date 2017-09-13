app.controller('profileCtrl', ['$scope', '$state', '$firebaseObject', '$ionicTabsDelegate', '$timeout','$state','$firebaseArray','$ionicScrollDelegate', 'socialLoginService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $firebaseObject, $ionicTabsDelegate, $timeout, ProfilePress,$state,$firebaseArray,$ionicScrollDelegate, socialLoginService) {
    $scope.description = 0;
    $scope.goback = function(){
      $state.go('profile');
    }

  }])
