app.controller('notificationPageCtrl', ['$scope', '$stateParams', 'UserInfo','$firebaseArray', '$firebaseObject', '$timeout', '$ionicScrollDelegate','$ionicPopover','$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $stateParams, UserInfo, $firebaseArray, $firebaseObject, $timeout, $ionicScrollDelegate,$ionicPopover,$ionicPopup) {

    var usr = UserInfo.getUserInfo();
    var authUser = firebase.auth().currentUser;
    var ref;

    $scope.selection = {tab: "yourevents"};
    $scope.goingList = [];
    $scope.notifications = [];
    $scope.youractions = [];

    $scope.$on('$ionicView.beforeEnter', function () //before anything runs
    {
      $scope.selection = {tab: "yourevents"};
       $scope.nKeyboardActive = true;
       $scope.selectYourActionTab();
      if ($scope.notifications.length == 0 && authUser == undefined) {
        console.log("Why yes it is!");
        firebase.auth().onAuthStateChanged(function (user) {
          authUser = firebase.auth().currentUser;
          ref = firebase.database().ref("Buildings").child(authUser.displayName + "/Users/" + authUser.uid);
          var loadit = $firebaseObject(ref);
          loadit.$loaded().then(function (x) {
            UserInfo.setUserInfo(x);
            usr = UserInfo.getUserInfo();
            refActivate();
          })
            .catch(function (error) {
              console.log("Error:", error);
            });
        });
      }
      else {
        ref = firebase.database().ref("Buildings").child(authUser.displayName + "/Users/" + authUser.uid);
        refActivate();
      }
    });

    $scope.$on('$ionicView.afterEnter', function () { //after all loads
      for (var i in $scope.youractions) {
        var listdate = $scope.youractions[i].info.date;
        var listtime = $scope.youractions[i].info.time;
        console.log($scope.youractions[i].info.date); //Thursday, March 4, 123   2:34 PM

        var splitted = listdate.split(" ");
        var resultingDate;
        for (i in splitted) {
          splitted[i].replace(/,/g, '');
        }
      }
    });

          function checkUser(item) {
      var removeit = true;
  if(item.puborpriv == "public")
      {
        return true;
      }
      for (var i in item.rolecall) {
        if (i == authUser.uid) {
          console.log("FOUND!");
          return true;
          break;
        }
      }
      if (removeit === true) {
        return false;
      }

    }


    window.addEventListener('native.keyboardshow', keyboardShowHandler);
    function keyboardShowHandler(e){
        $scope.nKeyboardActive = false;
        $timeout(function(){$scope.$apply();});

    }

    window.addEventListener('native.keyboardhide', keyboardHideHandler);
    function keyboardHideHandler(e){
        $scope.nKeyboardActive = true;
        $timeout(function(){$scope.$apply();});

    }


    //fuuuuuuuuuuuuuk
    var refActivate = function(){

        var ves = firebase.database().ref("Buildings").child(authUser.displayName + "/Users/" + authUser.uid).child('yourEvents');
        $scope.yourActionData = $firebaseArray(ves);
        $scope.yourActionData.$loaded()
          .then(function(x) {
            console.log("yourActions", $scope.yourActionData);
          });

          var vex = firebase.database().ref("Buildings").child(authUser.displayName + "/Users/");
        $scope.userData = $firebaseArray(vex);
        $scope.userData.$loaded()
          .then(function(x) {
            console.log("userData", $scope.userData);
          });

          var vet = firebase.database().ref("Buildings").child(authUser.displayName + "/UserEvents/");
        $scope.userEventData = $firebaseArray(vet);
        $scope.userEventData.$loaded()
          .then(function(x) {
            console.log("userEvents", $scope.userEventData);
            $scope.userJoinedData = x;

            for(var i = 0; i < x.length; i++)
            {
              //console.log("das boot:",x[i]);
              if($scope.userJoinedData[i].rolecall)
              {
                  //console.log("i has it",  $scope.userJoinedData[i].rolecall);
                  var hasUsr = false;
                  for(j in $scope.userJoinedData[i].rolecall)
                  {
                    //console.log("going for the BIG MONEY:", j);
                    if(authUser.uid == j)
                    {
                      //console.log("wowowowowow", j);
                      hasUsr = true;
                    }
                  }
                  if(hasUsr == false)
                  {
                    $scope.userJoinedData.splice(i,1);
                  }
              }
              else
              {
                $scope.userJoinedData.splice(i,1);
              }
            }
            //$scope.userJoinedData
          });



    };


      //autofill data


      function initAutocomplete() {
        $scope.autocomplete = new google.maps.places.Autocomplete(
            (document.getElementById('autocomplete')),
            {types: ['geocode','establishment']});

        container = document.getElementsByClassName('pac-container');
          // disable ionic data tab
          angular.element(container).attr('data-tap-disabled', 'true');
          // leave input field if google-address-entry is selected
          angular.element(container).on("click", function(){
              document.getElementById('searchBar').blur();
          });

        $scope.autocomplete.addListener('place_changed', fillInAddress);
      }

      function fillInAddress() {
        var place = $scope.autocomplete.getPlace();


        foundAddress = {
          street_number:"long_name",
          route:"long_name",
          locality: "long_name",
          administrative_area_level_1: "short_name",
          postal_code:"long_name"
        };

        for (var i = 0; i < place.address_components.length; i++)
        {
          var addressType = place.address_components[i].types[0];
          if (foundAddress[addressType])
          {
            foundAddress[addressType] = place.address_components[i][foundAddress[addressType]];
            console.log("things:", foundAddress[addressType]);
          }
        }
        console.log("final address: ",foundAddress );

        for(i in foundAddress)
        {
          /*if(foundAddress[i] == "long_name" || foundAddress[i] == "short_name")
          {
            console.log("not accepted!", foundAddress[i]);
            foundAddress[i] = "";
          }*/
        }

  (foundAddress['street_number'] == "long_name") ? foundAddress['street_number'] = "" : foundAddress['street_number'] = foundAddress['street_number'] + " ";
  (foundAddress['route'] == "long_name") ? foundAddress['route'] = "" : foundAddress['route'] = foundAddress['route'] + ", ";
  (foundAddress['locality'] == "long_name") ? foundAddress['locality'] = "" : foundAddress['locality'] = foundAddress['locality'] + ", ";
  (foundAddress['administrative_area_level_1'] == "short_name") ? foundAddress['administrative_area_level_1'] = "" : foundAddress['administrative_area_level_1'] = foundAddress['administrative_area_level_1'] + ", ";
  (foundAddress['postal_code'] == "long_name") ? foundAddress['postal_code'] = "" : foundAddress['postal_code'] = foundAddress['postal_code'];


        $scope.modalOpen.info.location = foundAddress['street_number'] +
        foundAddress['route'] +
        foundAddress['locality'] +
        foundAddress['administrative_area_level_1'] +
        foundAddress['postal_code'];

         console.log("final print:", $scope.modalOpen.info.location);

         //document.getElementById('autocomplete').value = $scope.modalOpen.info.location;
      }


      container = document.getElementsByClassName('pac-container');
      // disable ionic data tab
      angular.element(container).attr('data-tap-disabled', 'true');
      // leave input field if google-address-entry is selected
      angular.element(container).on("click", function(){
          document.getElementById('searchBar').blur();
      });



      $scope.geolocate = function() {

          google.maps.event.addDomListener(window, 'load', initAutocomplete);
          initAutocomplete();



        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
              center: geolocation,
              radius: position.coords.accuracy
            });
            $scope.autocomplete.setBounds(circle.getBounds());
          });
        }
      };




    $scope.selectNotificationTab = function () {
      //change css class to udnerline the selected tab
      document.getElementById("NotificationButton").className = "eoko-button-text-selected eoko-text-button-nav";
      document.getElementById("YourActionButton").className = "eoko-button-text eoko-text-button-nav";
      $scope.selection.tab = "notifications";
    };


    $scope.selectYourActionTab = function () {
      //change css class to udnerline the selected tab
      document.getElementById("NotificationButton").className = "eoko-button-text eoko-text-button-nav";
      document.getElementById("YourActionButton").className = "eoko-button-text-selected eoko-text-button-nav";
      $scope.selection.tab = "yourevents";
    };


    $scope.goToAction = function (action) {
      console.log("GOTOACTION:", action);
    };

    function getIonWidth(curr) {
      if (curr.hasClass('item-thumbnail-left')) {
        return curr[0];
      }
      else {
        return getIonWidth(curr.parent());
      }
    }

    $scope.draggedStyle = {};
    var swiped;

    $scope.onDrag = function (event, index) {
      swiped = false;
      $ionicScrollDelegate.$getByHandle('mainScroll').freezeScroll(true);
      $scope.draggedStyle[index] = {
        "transform": "translate(" + event.gesture.deltaX + "px)",
        "-webkit-transform": "translate(" + event.gesture.deltaX + "px)"
      };
    };

    $scope.onRelease = function (event, index, notify) {
      $ionicScrollDelegate.$getByHandle('mainScroll').freezeScroll(false);
      if (swiped === false) {
        var ionitem = getIonWidth(angular.element(event.srcElement));

        if (event.gesture.deltaX < (ionitem.offsetWidth * 0.618) * -1) {
          $scope.onSwipeLeft(notify, index);
        }
        else {
          $scope.draggedStyle[index] = {
            "transform": "translate(" + 0 + "px)",
            "-webkit-transition": "transform 0.61s",
            "-moz-transition": "transform 0.61s",
            "-ms-transition": "transform 0.61s",
            "-o-transition": "transform 0.61s",
            "transition": "transform 0.61s"
          };
        }

      }
    };



    $scope.onSwipeLeft = function (notify, index) {
      console.log(index);
      swiped = true;
      $scope.draggedStyle[index] = {
        "transform": "translate(" + -100 + "%)",
        "-webkit-transition": "transform 0.61s",
        "-moz-transition": "transform 0.61s",
        "-ms-transition": "transform 0.61s",
        "-o-transition": "transform 0.61s",
        "transition": "transform 0.61s"
      };
      $timeout(function () {
        console.log("Swiped left, remove object");


        delete $scope.draggedStyle[index];
        //$scope.draggedStyle[index] = {};
        $scope.notifications.splice(index, 1);
        console.log(index);


        ref.child('notifications/' + notify.key).remove().then(function () {
          console.log("object removed from database");
        });

      }, 610);

      /**/
    };


    $scope.blurry = {behind: "0px"};

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
        $scope.editNotify = 'false';
        $scope.modalOpen = {};
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


    $scope.checkHit = function (event) {
      if (event.target.className.includes("popup-container popup-showing")) {
        $scope.closePopover();
      }
    };

    /*$scope.NotificationEdit = function(choice)
    {
      $scope.editNotify = choice;
    };*/

    $scope.openPopover = function (event, notify,choice) {
      console.log("THIS ONE:,",$scope.modalOpen);
      $scope.blurry.behind = "5px";

      var tempdata = {
        info: notify,
        key: notify.$id
      };
      $scope.modalOpen = JSON.parse(JSON.stringify(tempdata));
      $scope.modalOrigin = JSON.parse(JSON.stringify(tempdata));

      console.log("modal = ", $scope.modalOpen, "origin = ", $scope.modalOrigin);

      $scope.editNotify = choice;
      if(choice == 'true'){
        var temp = $scope.modalOpen.info.date.split(',');
        temp.splice(0,1);
        var final = temp[0] + ", " + temp[1];
        $scope.modalOpen.info.date = new Date(final);
        $scope.modalOpen.info.time = new Date(final + ", " + $scope.modalOpen.info.time);
      }

      console.log("popupInfo",$scope.modalOpen );
      findgoing();
      $scope.popover.show(event);
      makeblurry();
    };

    $scope.closePopover = function () {
      $scope.blurry.behind = "0px";
      $scope.editNotify = 'false';
      $scope.popover.hide();
      makeblurry();

    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.blurry.behind = "0px";
      $scope.editNotify = 'false';
      $scope.popover.remove();
      makeblurry();
    });


    $scope.joinEvent = function (notify) {
      ref.child(notify.key + "/rolecall/" + authUser.uid).set({
        'going': true
      }).then(function () {
        $scope.closePopover();
      });
    };





    var weekday = new Array();
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

    $scope.updateListing = function(notify)
    {
      var rec = firebase.database().ref("Buildings").child(authUser.displayName + "/Users/");

      var d = notify.info.date;
      var tempdate = weekday[d.getDay()] + ", " + month[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
      var temptime = notify.info.time.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});


        console.log("FUCKING LES DO THIS");
      var rex = firebase.database().ref("Buildings").child(authUser.displayName + "/UserEvents/");
        rex.orderByChild("title").equalTo($scope.modalOrigin.info.title).once("value").then(function(success)
        {
          console.log( "level1 success", success.val());
          for(i in success.val())
          {
            console.log("loggin",i);
            rex.child(i).once("value").then(function(success2)
            {
              console.log("ffs", success2.val());
            });
            rex.child(i).update({
            title: notify.info.title,
            description: notify.info.description,
            location: notify.info.location,
            date: tempdate,
            time: temptime
        });
           console.log("done with first one");
          }

          rec.child(authUser.uid + "/yourEvents").child(notify.key).update({
          title: notify.info.title,
          description: notify.info.description,
          location: notify.info.location,
          date: tempdate,
          time: temptime
          });
          console.log("done with second one");
        },
        function(fail)
        {
            console.log("dafuq happened?", fail);
        });

      $scope.closePopover();
       $timeout(function(){$scope.$apply();});
    };

    $scope.$on('$ionicView.leave', function () //before anything runs
    {
      $scope.closePopover();
      $scope.blurry.behind = "0px";
       $timeout(function(){$scope.$apply();});
    });


    $scope.deleteListing = function(notify)
    {
      $scope.blurry = {behind: "5px"};

      var confirmPopup = $ionicPopup.confirm({
       title: 'Title',
       cssClass: 'eoko-alert-pop-up',
       template: 'Are you sure you want to delete this action?'
    });
      confirmPopup.then(function(res) {
       if(res) {
          console.log('Delete!');  //removes from yourEvents
          console.log(authUser.displayName,authUser.uid,notify.$id);
          var rec = firebase.database().ref("Buildings").child(authUser.displayName + "/Users/");
          rec.child(authUser.uid + "/yourEvents").child(notify.$id).remove();

            //removes from UserEvents
          var rex = firebase.database().ref("Buildings").child(authUser.displayName + "/UserEvents/");
          rex.orderByChild("title").equalTo(notify.title).once("value").then(function(success)
          {

           for(i in success.exportVal()) //iterates over rolslcall
            {
              if(success.val()[i].rolecall != null || success.val()[i].rolecall != undefined)
              {
                  for(j in success.val()[i].rolecall)
                  {
                    console.log(j);
                    rec.child(j + "/yourEvents").child(notify.$id).remove();
                  }
              }
            }


          },
          function(fail)
          {
            console.log("didnt find squat");
          });

          //rex.child(notify.key).remove();

          $scope.blurry.behind = "0px";
       } else {
          console.log('Cancel!');
          $scope.blurry.behind = "0px";
          return;
       }
    });
      $timeout(function(){$scope.$apply();});
    };







  }])
