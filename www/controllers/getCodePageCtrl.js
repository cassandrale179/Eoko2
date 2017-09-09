app.controller('getCodePageCtrl', ['$scope', '$stateParams', '$state', 'UserInfo', '$ionicPopup',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $stateParams, $state, UserInfo, $ionicPopup) {

    $scope.user = $stateParams.userinfo;
    console.log($scope.user);

    /*function createUser(){
     $state.go('getPicturePage');
     }*/

     window.addEventListener('native.keyboardshow', keyboardShowHandler);

    function keyboardShowHandler(e){
       //showAlert('Keyboard height is: ' + e.keyboardHeight);
        //alert('Keyboard height is: ' + e.keyboardHeight);
    }


    function createUser() {
      firebase.auth().createUserWithEmailAndPassword($scope.user.email, $scope.user.password)
        .then
        (function (success) {
          var usr = firebase.auth().currentUser;
          //var month = $scope.user.birthday.getUTCMonth() + 1; //months from 1-12
          //var day = $scope.user.birthday.getUTCDate();
          //var year = $scope.user.birthday.getUTCFullYear();
          //var newdate = month + "/" + day + "/" + year;
          var name = $scope.user.firstname + " " + $scope.user.lastname;
          //console.log(newdate);
          usr.updateProfile({displayName: $scope.user.buildcode}).then(function (suc) {


              var ref = firebase.database().ref("Buildings").child($scope.user.buildcode + "/Users");

              var userInfo = {
                name: name,
                email: usr.email,
                birthday: "",
                points: 0,
                eventCount: 0,
                surveyCount: 0,
                major: "",
                avatar: "",
                buildcode: $scope.user.buildcode,
                description: ""
              };
              ref.child(usr.uid).set(userInfo);

              UserInfo.setUserInfo(userInfo);

              console.log("User Logged in!");
              $state.go('getPicturePage');

            },
            function (error) {
              showAlert(error.message);
              console.log(error);
            });
          },
          function(error){
            showAlert(error.message);
        });

    }

    $scope.blurry = {behind: "0px"};

    //alert for wrong credential
    function showAlert(message) {
      $scope.blurry = {behind: "5px"};

      var alertPopup = $ionicPopup.alert({
        title: 'Login Error',
        cssClass: 'eoko-alert-pop-up',
        template: message
      });
      alertPopup.then(function(res) {
        $scope.blurry = {behind: "0px"};
      });
    }


    $scope.signupUser = function ()  //goes here first
    {
      var letters = /^[0-9a-zA-Z]+$/;
      var inputtext = $scope.user.buildcode.toString().toUpperCase();
      if(inputtext.match(letters))
      {
          var ref = firebase.database().ref();
          var verified = false;
          ref.orderByKey().once("value").then(function (snapshot) {
            var result = Object.keys(snapshot.child('Buildings').val());
            for (var i = 0; i < result.length; i++) {
              if (result[i] == $scope.user.buildcode) {
                verified = true;
              }
            }
            if (verified === false) {
              showAlert("No building located");
              console.log("NO BUILDING LOCATED");
            }
            else {
              createUser();  //verified, create user
            }
          });
        }
        else
        {
        showAlert("Must be alphanumeric");
        return;
      }


    };


  }])
