
app.controller('buildingEventsCtrl', ['$scope', '$stateParams', 'UserInfo','$firebaseObject','$firebaseArray','$ionicPopup','$ionicPopover','$ionicSlideBoxDelegate', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller

// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $stateParams,UserInfo,$firebaseObject,$firebaseArray,$ionicPopup,$ionicPopover,$ionicSlideBoxDelegate) {

    var usr = UserInfo.getUserInfo();
    var authUser = firebase.auth().currentUser;
    var ref = firebase.database().ref("Buildings").child(usr.buildcode + "/Admin/buildingEvents");

    $scope.$on('$ionicView.beforeEnter', function () //before anything runs
    {
      usr = UserInfo.getUserInfo();
      console.log("working?", UserInfo.getUserInfo());
      if (authUser == undefined || usr.email == "") {
        console.log("Why yes it is!");
        firebase.auth().onAuthStateChanged(function (user) {
          console.log("auth is in");
          authUser = firebase.auth().currentUser;
          console.log(authUser);
          var rez = firebase.database().ref("Buildings").child(authUser.displayName + "/Users/" + authUser.uid);
          var loadit = $firebaseObject(rez);
          loadit.$loaded().then(function (x) {
            console.log("loaded!");
            UserInfo.setUserInfo(x);
            usr = UserInfo.getUserInfo();
            ref = firebase.database().ref("Buildings").child(usr.buildcode + "/Admin/buildingEvents");
            $scope.buildingEventList = $firebaseArray(ref);
            $scope.buildingEventList.$loaded().then(function(y)
            {
              //console.log("le done!",$scope.buildingEventList);
              $scope.buildingEventList = categorySort(y);
              console.log("newlist",$scope.buildingEventList);

              var red = firebase.database().ref("Buildings").child(authUser.displayName + "/Users");
              $scope.userData = $firebaseArray(red);
              $scope.userData.$loaded().then(function()
              {
                console.log("userdata", $scope.userData);
                var req = firebase.database().ref("Buildings").child(usr.buildcode + "/Admin/Surveys");
                $scope.surveyList = $firebaseArray(req);
                $scope.surveyList.$loaded().then(function()
                {
                  console.log("surveylist", $scope.surveyList);

                });
              });

            });

          })
            .catch(function (error) {
              console.log("Error:", error);
            });

        });
      }
      else
      {
        $scope.buildingEventList = $firebaseArray(ref);
          $scope.buildingEventList.$loaded().then(function(y)
          {
            //console.log("le done!",$scope.buildingEventList);
            $scope.buildingEventList = categorySort(y);
            console.log("newlist",$scope.buildingEventList);

            var red = firebase.database().ref("Buildings").child(authUser.displayName + "/Users");
              $scope.userData = $firebaseArray(red);
              $scope.userData.$loaded().then(function(z)
              {
                console.log("userdata", $scope.userData);
                var req = firebase.database().ref("Buildings").child(usr.buildcode + "/Admin/Surveys");
                $scope.surveyList = $firebaseArray(req);
                $scope.surveyList.$loaded().then(function()
                {
                  console.log("surveylist", $scope.surveyList);

                });
              });
          });
      }
    });

    $scope.takeSurvey = function(survey)
    {
      $scope.feedbackSelector.tab = 'questions';
      $scope.survey = survey;

      $scope.surveyResults = {
        email: authUser.email,
        id: authUser.uid,
        answers: []
      };

      for(var i in survey.questions)
      {
        $scope.surveyResults.answers.push({
          question: survey.questions[i].title,
          index: i,
          answer: ""});
      }

    };

    $scope.recordAnswer = function(index,answer)
    {
      for(var i in $scope.surveyResults.answers)
      {
        if(index == $scope.surveyResults.answers[i].index)
        {
          $scope.surveyResults.answers[i].answer = answer;
        }
      }
        console.log("recorded answer", $scope.surveyResults);
    };

    $scope.submitSurvey = function(survey)
    {
      var req = firebase.database().ref("Buildings").child(usr.buildcode + "/Admin/Surveys").child(survey.$id).child("answers");
      req.push($scope.surveyResults).then(function(done)
        {
          console.log("survey submitted");
          showAlert("Survey has been submitted successfully");
          $scope.selection.tab = "feedback";
          $scope.feedbackSelector.tab = 'selector';
        });

    };

    function showAlert(message) {
      //$scope.blurry = {behind: "5px"};

      var alertPopup = $ionicPopup.alert({
        title: 'Login Error',
        cssClass: 'eoko-alert-pop-up',
        template: message
      });
      alertPopup.then(function(res) {
        //$scope.blurry = {behind: "0px"};
      });
    };

    $scope.next = function() {
      $ionicSlideBoxDelegate.next();
    };


    function categorySort(list)
    {
      categoryList = {};
      for(var i in list)
      {
        if(!(list[i].category in categoryList))
        {
          categoryList[list[i].category] = [];
          categoryList[list[i].category].push(list[i]);
        }
        else
        {
          categoryList[list[i].category].push(list[i]);
        }
      }
      delete categoryList['undefined'];

      return categoryList;
    }

    $scope.selection = {tab: "bevents"};

    $scope.selectBuildingEventTab = function () {
      document.getElementById("BuildingEventButton").className = "eoko-button-text-selected eoko-text-button-nav";
      document.getElementById("FeedBackButton").className = "eoko-button-text eoko-text-button-nav";
      document.getElementById("RankingButton").className = "eoko-button-text eoko-text-button-nav";
      $scope.selection.tab = "bevents";
    };

    $scope.selectFeedbackTab = function () {
      document.getElementById("FeedBackButton").className = "eoko-button-text-selected eoko-text-button-nav";
      document.getElementById("BuildingEventButton").className = "eoko-button-text eoko-text-button-nav";
      document.getElementById("RankingButton").className = "eoko-button-text eoko-text-button-nav";
      $scope.selection.tab = "feedback";
      $scope.feedbackSelector.tab = 'selector';
    };

    $scope.selectRankingTab = function () {
      document.getElementById("RankingButton").className = "eoko-button-text-selected eoko-text-button-nav";
      document.getElementById("BuildingEventButton").className = "eoko-button-text eoko-text-button-nav";
      document.getElementById("FeedBackButton").className = "eoko-button-text eoko-text-button-nav";
      $scope.selection.tab = "ranking";
    };


    $scope.feedbackSelector = {tab: "selector"};

    $scope.feebackChoose = function(choice)
    {
      $scope.feedbackSelector.tab = choice;
    };

    $scope.surveysNotDone = function(item)
    {
      var found = false;
      for(var i in item.answers)
      {
        if(authUser.uid == item.answers[i].id)
        {
          found = true;
          break;
        }
      }
      if(found == false)
      {
        return item;
      }
    };

    $scope.comment = {text:"",anonymous:false};

    $scope.submitComment = function()
    {
      var com = {};
      if($scope.comment.anonymous == false)
      {
        com = {
          email: authUser.email,
          id: authUser.uid,
          date: new Date(),
          text: $scope.comment.text
        };
      }
      else
      {
        com = {
          email: "Anonymous",
          id: "Anonymous",
          date: new Date(),
          text: $scope.comment.text
        };
      }

      var req = firebase.database().ref("Buildings").child(usr.buildcode + "/Admin/Comments");
      req.push(com).then(function(done)
        {
          console.log("comment submitted");
          showAlert("Comment has been submitted successfully");
          $scope.selection.tab = "feedback";
          $scope.feedbackSelector.tab = 'selector';
          $scope.comment.text = "";
          $scope.comment.anonymous = false;
        });
    };


    // .fromTemplateUrl() method
    $ionicPopover.fromTemplateUrl('eventFullView.html', {
      scope: $scope,
      backdropClickToClose: true,
      hardwareBackButtonClose: true
    })
      .then(function (popover) {
        $scope.popover = popover;
      });


    function makeblurry() {
      if ($scope.popover.isShown()) {
        console.log("blur background");
        $scope.blurry = {behind: "5px"};
      }
      else {
        console.log("clear up");
        $scope.blurry = {behind: "0px"};
      }
    }

    function findgoing() {
      $scope.goingList = [];
      var selectedlist = [];
      for (var i in $scope.modalOpen.info.rolecall) {
        console.log("checking: ", $scope.modalOpen.info.rolecall[i].going);
        if ($scope.modalOpen.info.rolecall[i].going === true) {
          console.log("true!,", i);
          selectedlist.push(i);
        }
      }
      console.log("list has ", selectedlist.length);
      console.log("list is: ", selectedlist);
      if (selectedlist.length > 0) {
        var req = firebase.database().ref("Buildings").child(usr.buildcode + "/Users");
        for (var i = 0; i < selectedlist.length; i++) {
          req.child(selectedlist[i]).once('value').then(function (snap) {
            $scope.goingList.push({info: snap.val()});
            console.log("record: ", snap.val());
            $timeout(function () {
              $scope.$apply();
            });
          });
        }
      }
    }

    $scope.blurry = {behind: "0px"};

    $scope.checkHit = function (event) {
      if (event.target.className.includes("popup-container popup-showing")) {
        $scope.closePopover();
      }
    };

    $scope.openPopover = function (event, notify) {
      $scope.blurry.behind = "5px";
      $scope.modalOpen = {
        info: notify
      };
      console.log("popupInfo",$scope.modalOpen );
      findgoing();
      $scope.popover.show(event);
      makeblurry();
    };

    $scope.closePopover = function () {
      $scope.blurry.behind = "0px";
      $scope.popover.hide();
      makeblurry();

    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.blurry.behind = "0px";
      $scope.popover.remove();
      makeblurry();
    });


    $scope.joinEvent = function (notify) {
      /*ref.child(notify.key + "/rolecall/" + authUser.uid).set({
        'going': true
      }).then(function () {
        $scope.closePopover();
      });*/
      $scope.closePopover();
    };


    //go to other profile from action detail popup
    $scope.openProfile = function (clicked,uid) {
      OtherInfo.setOtherInfo(clicked,uid);
      $scope.closePopover();
      $state.go('profile', {
        'avatarClicked': 'true'
      });
    };

    //hold on the avatar to send the message
    $scope.openMessagePopover = function (event, notify) {
      $scope.blurry.behind = "5px";
      messageUser = notify;
      $scope.popover.show(event);
      makeblurry();
    };


    //store the selected button for showAttendants()
    var selected = "";
    //showing attendants of the action in poppu
    $scope.showAttendants = function (button) {


      //change the selected button to orange and hide details
      document.getElementById(button).style.background = "#F57C00";
      document.getElementById("actionDetail").className = "eoko-hide";
      document.getElementById("attendants").className = "eoko-show";

      //change other buttons to normal color
      switch (button) {
        case "goingButton":
          document.getElementById("maybeButton").style.background = "rgba(255, 255, 255, 0.4)";
          document.getElementById("declinedButton").style.background = "rgba(255, 255, 255, 0.4)";
          document.getElementById("invitedButton").style.background = "rgba(255, 255, 255, 0.4)";
          break;
        case "maybeButton":
          document.getElementById("goingButton").style.background = "rgba(255, 255, 255, 0.4)";
          document.getElementById("declinedButton").style.background = "rgba(255, 255, 255, 0.4)";
          document.getElementById("invitedButton").style.background = "rgba(255, 255, 255, 0.4)";
          break;
        case "declinedButton":
          document.getElementById("goingButton").style.background = "rgba(255, 255, 255, 0.4)";
          document.getElementById("maybeButton").style.background = "rgba(255, 255, 255, 0.4)";
          document.getElementById("invitedButton").style.background = "rgba(255, 255, 255, 0.4)";
          break;
        case "invitedButton":
          document.getElementById("goingButton").style.background = "rgba(255, 255, 255, 0.4)";
          document.getElementById("maybeButton").style.background = "rgba(255, 255, 255, 0.4)";
          document.getElementById("declinedButton").style.background = "rgba(255, 255, 255, 0.4)";
          break;
      }

      //deselect a button
      if (selected === button) {
        document.getElementById(button).style.background = "rgba(255, 255, 255, 0.4)";
        document.getElementById("actionDetail").className = "eoko-show";
        document.getElementById("attendants").className = "eoko-hide";
        selected = "";
      } else {
        selected = button;
      }
    };



  }])
