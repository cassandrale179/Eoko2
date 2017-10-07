app.controller('settingPageCtrl', ['$scope', '$state', '$firebaseAuth', '$localStorage',
function($scope, $state, $firebaseAuth, $localStorage){

  //---------- SET INITIAL MODE TO VIEW SETTINGS --------------
  $scope.view = true;
  $scope.age = {
    low: 20,
    high: 80
  }

  //-------- CHECK IF CURRENT USER IS LOGGING IN --------------
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $scope.currentUser = user;
      console.log($scope.currentUser.uid);
      console.log("User currently signs in");
    }
    else{
      console.log("User is not signed in");
    }

    //------------------ SET PRIVATE / PUBLIC SETTINGS FOR EVENTS --------------------
    var userRef = firebase.database().ref("users/" + $scope.currentUser.uid);
    $scope.setPublic = function(){
      userRef.update({privacy: 'public'});
      $localStorage.eventPrivacy = 'public';
      console.log("Set user's preference to public");
      $state.go('settingPage');
    }
    $scope.setPrivate = function(){
      userRef.update({privacy: 'private'})
      $localStorage.eventPrivacy = 'private';
      console.log("Set user's preference to private");
      $state.go('settingPage');
    }
    $scope.setBoth = function(){
      userRef.update({privacy: 'both'})
      console.log("No preferences");
      $state.go('settingPage');
    }
    $scope.submitAge = function(){
      userRef.update($scope.age);
      console.log("successfully update age");
    }

    //------------------ SET PRIVATE / PUBLIC SETTINGS FOR THE USER --------------------
    $scope.displaySetting = function(privacy){
      userRef.update({
        display: privacy
      })
      $scope.displayMessage = privacy;
    }


    //------------- THE TEXT WILL CHANGE COLOR ------------
    userRef.on("value", function(snapshot){
      var privacy = snapshot.val().privacy;
      if (privacy == "private"){
        $scope.private = {
          'border': 'none',
          'background': 'rgba(255,255,255,0.5)',
          'color': 'black'
        }
        $scope.public = {}
        $scope.both = {}
      }
      else if (privacy == 'public'){
        $scope.public = {
          'border': 'none',
          'background': 'rgba(255,255,255,0.5)',
          'color': 'black'
        }
        $scope.private = {}
        $scope.both = {}
      }

      else if (privacy == 'both'){
        $scope.both = {
          'border': 'none',
          'background': 'rgba(255,255,255,0.5)',
          'color': 'black'
        }
        $scope.public = {}
        $scope.private = {}
      }


      //----------- CHANGE CORRESPONDING TEXT DEPENDING ON THE DISPLAY ------------
      var display = snapshot.val().display;
      var clicked = {
        'border': 'none',
        'background': 'rgba(255,255,255,0.5)',
        'color': 'black'
      }
      var unclicked = {}
      if (display == 'public'){
        $scope.public2 = clicked

        $scope.private2 = unclicked
        $scope.hidden = unclicked
      }
      else if (display == 'private'){
        $scope.private2 = clicked

        $scope.public2 = unclicked
        $scope.hidden = unclicked
      }
      else if (display == 'hidden'){
        $scope.hidden = clicked;

        $scope.public2 = unclicked;
        $scope.private2 = unclicked;

        }


        //Filtering people in peoplePage
        $localStorage.peopleFilter = snapshot.val().peopleFilter;
        if ($localStorage.peopleFilter=="public"){
          $scope.publicPeople = clicked;
          $scope.privatePeople = unclicked;
        }
        if ($localStorage.peopleFilter=="private"){
          $scope.privatePeople = clicked;
          $scope.publicPeople = unclicked;
        }
        $scope.peopleFilter = function(value){
          $localStorage.peopleFilter = value;
          userRef.update({
            peopleFilter: value
          })

        }
    })
  });

  $scope.signoutUser = function() {
    firebase.auth().signOut().then(function(){
      $state.go('login');
    })
  }



}])
