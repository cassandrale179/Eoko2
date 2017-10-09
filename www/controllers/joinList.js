app.controller('joinListCtrl', ['$scope', '$state', '$firebaseArray', '$firebaseObject', '$timeout','EditInfo','$ionicPopup',
  function ($scope, $state, $firebaseArray, $firebaseObject, $timeout,EditInfo,$ionicPopup) {

    //------------ PRESET SOME VARIABLES -------------
    $scope.show = 1;
    $scope.create = { 'border-bottom': '1px orange solid'};
    $scope.errorMessage = "";
    $scope.errorMessage2 = "";
    var myActions, joinActions, actionRef;
    $scope.nullActions = [];


    //--------------------------- CHECK IF USER IS LOG IN -------------------------
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

        //------------- LIST OF PROMISES TO BE WRITTEN -----------------
        var actionPromise = $scope.actionArray.$loaded();
        var joinPromise = $scope.joinArray.$loaded();

        //-------------- THIS IS HOW YOU WROTE A FUCKING PROMISE -----------------
        $scope.actionPopUp = function(x){
          console.log(x);
          $scope.show = 4;
          console.log($scope.show);
          Promise.all([actionPromise, joinPromise]).then(function(response){
            var actionResponse = response[0];
            var joinResponse = response[1];
            angular.forEach(joinResponse, function(value, key){
              var id = value.$id;
              if (actionResponse.$getRecord(id) == null){
                if (id == x.eventID){
                  showAlert("This event has expired");
                  joinActions.child(x.eventID).remove();
                }
              }
            });
          });
        }

        //----------------- ERROR HANDLING -------------------
        if (joinActions == undefined){
          $scope.errorMessage = "You have joined any action yet";
        }
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

      //------------------ SHOW ALERT -----------------
      function showAlert(message) {
      $scope.blurry = {behind: "5px"};
      var alertPopup = $ionicPopup.alert({
        title: 'Event has expired',
        cssClass: 'eoko-alert-pop-up',
        template: message
      });
      alertPopup.then(function(res) {
        $scope.blurry = {behind: "0px"};
      });
    }

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
