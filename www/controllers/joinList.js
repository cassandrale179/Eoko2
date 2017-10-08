app.controller('joinListCtrl', ['$scope', '$state', '$firebaseArray', '$firebaseObject', '$timeout','EditInfo','$ionicPopup',
  function ($scope, $state, $firebaseArray, $firebaseObject, $timeout,EditInfo,$ionicPopup) {
  
    var myActions, joinActions, actionRef;
    //--------- CHECK IF USER IS LOG IN ---------
    firebase.auth().onAuthStateChanged(function(user){
      if (user){
        $scope.currentUser = user;

        myActions = firebase.database().ref("users").child($scope.currentUser.uid).child('actions/myActions');
        joinActions = firebase.database().ref('users').child($scope.currentUser.uid).child('actions/joinActions');
        actionRef = firebase.database().ref('activities');

        $scope.createdArray = $firebaseArray(myActions);
        $scope.joinArray = $firebaseArray(joinActions);
        $scope.actionArray = $firebaseArray(actionRef);

        $scope.createdArray.$loaded();
        $scope.joinArray.$loaded();
        $scope.actionArray.$loaded();
      }

    });

    $scope.blurry = {behind: "0px"};

     function showNotifyAlert(message, info) {
        $scope.blurry = {behind: "5px"};

        var confirmPopup = $ionicPopup.confirm({
          title: 'Error',
          cssClass: 'eoko-alert-pop-up',
          template: message
        });
        confirmPopup.then(function(res) {
          if(res)
          {
            $scope.blurry = {behind: "0px"};
             myActions.child(info).remove();
            actionRef.child(info).remove();
            console.log("Successfully delete event");
            console.log("redirect to message");
            return true;
          }
          else
          {
            $scope.blurry = {behind: "0px"};
            return false;
          }

        });
      }

      //------------------ DELETE AN ACTION -----------------
      $scope.deleteAction = function(x){
        showNotifyAlert("Are you sure you want to delete this Action?", x);       
      };

      //---------------------------------- EDIT AN ACTION -------------------------------------
      $scope.editAction = function(x){
        //$scope.show = 2;
        console.log(x);
        var activity = firebase.database().ref("activities/" + x);
        activity.once("value", function(snapshot)
        {
          console.log("this is the this is the", snapshot.val(), snapshot.key);
          EditInfo.setEditInfo(snapshot.val());
          EditInfo.setEditing(true);
          EditInfo.setKey(snapshot.key);
          $state.go('actionCreate');
        });
      };

}]);
