app.controller('joinListCtrl', ['$scope', '$state', '$firebaseArray', '$firebaseObject', '$timeout',
  function ($scope, $state, $firebaseArray, $firebaseObject, $timeout) {

    //--------- PRESET SOME VARIBALES---------
    $scope.show = 1;
    $scope.selectTagList = [];
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

      //----------------------- EDIT AN ACTION -------------------
      $scope.editAction = function(x){
        $scope.show = 2;
        console.log(x);
        var activity = firebase.database().ref("activities/" + x);
        activity.on("value", function(snapshot){
          var activityTable = snapshot.val();
          $scope.action = activityTable;
          console.log("This is the action to edit");
          console.log($scope.action);
        });

        //------------- COLOR OF CLICK OR UNCLICKED BUTTON --------
        clicked = {
            "background": "rgba(230, 126, 34, 0.9)",
            "color": "white"
          };
        unclicked = {};

        //--------- CHECKING THE PRIVACY STATUS OF AN ACTION ------
        if ($scope.action.privacy == "public"){
          $scope.privSelect = "public";
          $scope.publicStyle = clicked;
        }
        if ($scope.action.privacy == "private"){
          $scope.privSelect = "private";
          $scope.prviateStyle = clicked;
        }
        if ($scope.action.privacy == "invite"){
          $scope.privSelect = "invite";
          $scope.inviteStyle = clicked;
        }


        //-------=--------- SET PRIVACY OF ACTION --------------
        $scope.setPrivacy = function(privacy)
        {
          if (privacy == "public")
          {
            $scope.publicStyle = clicked;
            $scope.privateStyle = unclicked;
            $scope.inviteStyle = unclicked;
            $scope.privSelect = 'public';
          }

          if (privacy == "private")
          {
            $scope.privateStyle = clicked;
            $scope.publicStyle = unclicked;
            $scope.inviteStyle = unclicked;
            $scope.privSelect = 'private';
          }

          if (privacy == "invite")
          {
            $scope.privateStyle = unclicked;
            $scope.publicStyle = unclicked;
            $scope.inviteStyle = clicked;
            $scope.privSelect = 'invite';
          }
          $scope.action.privacy = privacy;
        };



      //--------------------- TAGS STUFF --------------------
      var tagsRef = firebase.database().ref('actions');
      $scope.tagSelect = $firebaseArray(tagsRef);
      $scope.tagSelect.$loaded(function(arr){
        console.log("taglist create", $scope.tagSelect);
      });


      //------------- WHEN USER SELECT A TAG -----------------
      $scope.selectionTag = function (elementId)
      {
        console.log("started select");
        var elementClass = document.getElementById(elementId).className;
        if(elementClass == "eoko-horizontal-scroll-button eoko-text-thin activated" || elementClass == "eoko-horizontal-scroll-button eoko-text-thin ng-binding activated")
        {
          console.log("activated");
          document.getElementById(elementId).className = "eoko-horizontal-scroll-button-selected eoko-text-thin";
          $scope.selectTagList.push(elementId.replace(/create/,''));
        }else{
          console.log("not activated");
          document.getElementById(elementId).className = "eoko-horizontal-scroll-button eoko-text-thin";
          for(var i in $scope.selectTagList)
          {
            console.log("for loopin" , i);
            if($scope.selectTagList[i] == elementId.replace(/create/,''))
            {
              console.log("splicin");
                  $scope.selectTagList.splice(i, 1);
            }
          }
        }
        if($scope.selectTagList == [])
        {
          console.log("nuller than a null pointer");
          $scope.selectTagList = null;
        }
        console.log("searching",$scope.selectTagList);
        $timeout(function(){$scope.$apply();});
      };


        //--------- EDIT SUBMIT BUTTON ---------------
        $scope.submit = function(){
          activity.update($scope.action);
          console.log("Update action");
          console.log($scope.action);
          $state.go('navController.notification');
          $scope.show = 1;
        }
      };


    //--------------------------- ACTION THAT YOU HAVE CREATE WILL BE CAPTURE HERE --------------------
    var actionRef = firebase.database().ref("users/" + $scope.currentUser.uid + "/actions/");
    actionRef.on("value", function(snapshot){
      if (snapshot.val() == undefined){
        $scope.errorMessage = "You have not created any action";
        $scope.errorMessage2 = "You have not joined any action"
      }
      else{
        var createAction = snapshot.val().myActions;
        var joinActions = snapshot.val().joinActions;
        console.log("This is action you have created");
        console.log(createAction);

        if (createAction == undefined){
          $scope.errorMessage = "You have not creatd any action";
        }
        if (joinActions == undefined){
          $scope.errorMessage2 = "You have not joined any action";
        }
        if (createAction != undefined){
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
                  activityTable[$scope.myEventID[i]].eventid = $scope.myEventID[i];
                }
                if (activityTable.hasOwnProperty($scope.joinEventID[i])){
                  $scope.joinEvents.push(activityTable[$scope.joinEventID[i]]);
                  activityTable[$scope.joinEvents[i]].eventid = $scope.joinEventID[i];
                }
            }
              console.log("List of created events");
              console.log($scope.myEvents);
              console.log("List of joined events");
              console.log($scope.joinEvents)
            })
        }
      }
    })
  })
}]);
