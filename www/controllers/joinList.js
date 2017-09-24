app.controller('joinListCtrl', ['$scope', '$state', '$firebaseArray', '$firebaseObject',
  function ($scope, $state, $firebaseArray, $firebaseObject) {

    //--------- PRESET SOME VARIBALES---------
    $scope.show = 1;
    $scope.errorMessage = ""
    var input = document.getElementById('pac-input');
    var autocomplete = new google.maps.places.Autocomplete(input);

    //--------- CHECK IF USER IS LOG IN ---------
    firebase.auth().onAuthStateChanged(function(user){
      if (user){
        $scope.currentUser = user;
      }


      //------- DELETE AN ACTION -----------------
      $scope.deleteAction = function(x){
        var activitiesRef = firebase.database().ref("users/" + $scope.currentUser.uid + "/actions/myActions");
        activitiesRef.child(x).remove();
        console.log("Successfully delete event");

      }

      //------- EDIT AN ACTION -------------------
      $scope.editAction = function(x){
        $scope.show = 2;
        var activity = firebase.database().ref("activities/" + x);
        activity.on("value", function(snapshot){
          var activityTable = snapshot.val();
          $scope.action = activityTable;
        })

        //------------ TAGS -----------------
        var tagsRef = firebase.database().ref('actions');
        $scope.tagsArray = $firebaseArray(tagsRef);
        $scope.tagsArray.$loaded(function(arr){
        })

        clicked = {"background": "rgba(230, 126, 34, 0.9)", "color": "white"};
        unclicked = {};

        $scope.publicStyle = clicked;
        $scope.action.privacy = 'public';
        $scope.selectedTags = [];
        $scope.addTag = function(tag) {
          var index = $scope.selectedTags.indexOf(tag);
          if (index!=-1){
            $scope.selectedTags.splice(index, 1);
          }
          else{
            $scope.selectedTags.push(tag);
          }
          console.log($scope.selectedTags);

        }

        $scope.setStyle = function(tag) {
          if ($scope.selectedTags.indexOf(tag)==-1){
            return unclicked;
          }
          else {
            return clicked;
          }
        }

        //--------- EDIT BUTTON ---------------
        $scope.submit = function(){
          activity.update($scope.action);
          console.log("Update action");
          console.log($scope.action);
          $state.go('joinList');
          $scope.show = 1;
        }
      }



    //--------------------------- ACTION THAT YOU HAVE CREATE WILL BE CAPTURE HERE --------------------
    var actionRef = firebase.database().ref("users/" + $scope.currentUser.uid + "/actions");
    actionRef.on("value", function(snapshot){
      var createAction = snapshot.val().myActions;
      var joinActions = snapshot.val().joinActions;
      if (createAction == undefined){
        $scope.errorMessage = "You have not creatd any action";
      }
      if (joinActions == undefined){
        $scope.errorMessage2 = "You have not joined any action";
      }
      else{
      $scope.errorMessage = "";
      $scope.myEventID = []
      $scope.myEvents = []
      $scope.photos = []

      $scope.joinEventID = []
      $scope.joinEvents = []
      $scope.photos2 = []

      for (var key in createAction){
        $scope.myEventID.push(key)
      }
      for (var key2 in joinActions){
        $scope.joinEventID.push(key2)
      }

      var activitiesRef = firebase.database().ref("activities/");
      activitiesRef.on("value", function(activitySnap){
        var activityTable = activitySnap.val();

        //-------------------- ACTIVITY TABLE ----------------------
        for (var i = 0; i < $scope.myEventID.length; i++){
            if (activityTable.hasOwnProperty($scope.myEventID[i])){
              $scope.myEvents.push(activityTable[$scope.myEventID[i]]);
            }
            if (activityTable.hasOwnProperty($scope.joinEventID[i])){
              $scope.joinEvents.push(activityTable[$scope.joinEventID[i]]);
            }
        }
          console.log("List of created events");
          console.log($scope.myEvents);
          console.log("List of joined events");
          console.log($scope.joinEvents)
        })
      }
    })
  })
}]);
