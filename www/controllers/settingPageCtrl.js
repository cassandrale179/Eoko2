app.controller('settingPageCtrl', ['$scope', '$state', '$firebaseAuth',
function($scope, $state, $firebaseAuth){

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
      console.log("Set user's preference to public");
      $state.go('settingPage');
    }
    $scope.setPrivate = function(){
      userRef.update({privacy: 'private'})
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
    $scope.displayPublic = function(){
      userRef.update({display: 'public'});
    }
    $scope.displayPrivate = function(){
      userRef.update({display: 'private'});
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
      if (display == 'public'){
        $scope.public2 = {
          'border': 'none',
          'background': 'rgba(255,255,255,0.5)',
          'color': 'black'
        }
        $scope.private2 = {}
      }
      else if (display == 'private'){
        $scope.private2 = {
          'border': 'none',
          'background': 'rgba(255,255,255,0.5)',
          'color': 'black'
        }
        $scope.public2 = {}
      }
    })
  });

  $scope.signoutUser = function() {
    firebase.auth().signOut().then(function(){
      $state.go('login');
    })
  }



}])
