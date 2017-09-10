app.controller('actionsCtrl', ['$scope', '$stateParams', 'UserInfo', 'OtherInfo', '$firebaseArray', '$firebaseObject', '$ionicPopover', '$timeout', '$state','$ionicPopup',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $stateParams, UserInfo, OtherInfo, $firebaseArray, $firebaseObject, $ionicPopover, $timeout, $state,$ionicPopup) {
    var usr = UserInfo.getUserInfo();
    var authUser = firebase.auth().currentUser;
    var ref = firebase.database().ref("Buildings").child(usr.buildcode + "/UserEvents");
    var eventdone = true;

    ionic.keyboard.disable();

    $scope.selection = {tab: "event", porb: "public", privstep: 1, nextstep:0};
    $scope.event = {title: "", location: "", date: new Date(), time: "", description: "",category:[]};
    $scope.goingList = [];
    $scope.notifications = [];

    $scope.$on('$ionicView.beforeEnter', function () //before anything runs
    {
      usr = UserInfo.getUserInfo();
      console.log("working?", UserInfo.getUserInfo());
      document.querySelector("#tabsController-tabs1 > div").style.display = "flex";
      try{
      document.querySelector("#page6 > ion-content > ion-scroll.eoko-horizontal-scroll.scroll-view.ionic-scroll.scroll-x").style.height = "46px";
        }catch(error){console.log("tried to format, not there");}
        $scope.nKeyboardActive = true;
        $timeout(function(){$scope.$apply();});

      if ($scope.notifications.length == 0 && authUser == undefined || usr.email == "") {
        console.log("Why yes it is!");
        firebase.auth().onAuthStateChanged(function (user) {
          authUser = firebase.auth().currentUser;
          var rez = firebase.database().ref("Buildings").child(authUser.displayName + "/Users/" + authUser.uid);
          var loadit = $firebaseObject(rez);
          loadit.$loaded().then(function (x) {
            UserInfo.setUserInfo(x);
            usr = UserInfo.getUserInfo();
            ref = firebase.database().ref("Buildings").child(usr.buildcode + "/UserEvents");
            refActivate();

          })
            .catch(function (error) {
              console.log("Error:", error);
            });
        });
      }
      else {
        refActivate();
      }

    });

     $scope.$on('$ionicView.leave', function () //before anything runs
    {
      $scope.closePopover();
      $scope.blurry.behind = "0px";
       $timeout(function(){$scope.$apply();});
    });


    $scope.$on('$ionicView.loaded', function () {

      console.log("THE PAGE HAS FULLY LOADED, EXECUTE ORDER NUMBER 66!");
    });

    $scope.blurry = {behind: "0px"};
    $scope.modalOpen = {
      info: "",
      key: "",
      attend: ""
    };



    /*$scope.searchEventFilter = [];
    //select filter
    $scope.selectFilter = function (elementId){
      var elementClass = document.getElementById(elementId).className;
      if(elementClass == "eoko-horizontal-scroll-button eoko-text-thin activated"){
        document.getElementById(elementId).className = "eoko-horizontal-scroll-button-selected eoko-text-thin";
      }else{
        document.getElementById(elementId).className = "eoko-horizontal-scroll-button eoko-text-thin";
      }


    };*/

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


        $scope.event.location = foundAddress['street_number'] +
        foundAddress['route'] +
        foundAddress['locality'] +
        foundAddress['administrative_area_level_1'] +
        foundAddress['postal_code'];

         console.log("final print:", $scope.event.location);

         //document.getElementById('autocomplete').value = $scope.event.location;
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

    $scope.getFriendList = function()
    {
      console.log("STARTING CUSTOM GET FRIENDS");
      $scope.friendlist = [];
      var tempfriendlist = [];

      var ref = firebase.database().ref("Buildings").child(authUser.displayName + "/Users");
        console.log(usr);
        $scope.userList = $firebaseArray(ref);
        $scope.userList.$loaded().then(function (x) {

      if(Object.keys(usr.friendlist).length > 0)
      {
        for (var i in Object.keys(usr.friendlist))
        {
          console.log("getkey", Object.keys(usr.friendlist)[i]);
          for (var j = 0; j < x.length; j ++)
          {
            if(Object.keys(usr.friendlist)[i] == x[j].$id)
            {
              console.log("found friend;",x[j]);
              tempfriendlist.push(x[j]);
            }
          }
        }
      }
       $scope.friendlist = chunk(tempfriendlist, 3);
       console.log("DONE GETTING FRIENDS",$scope.friendlist);
    });
    };

    function chunk(arr, size) {
      var newArr = [];
      for (var i = 0; i < arr.length; i ++)
      {
        if(arr[i].$id == $scope.owning.id)
          {
            arr.splice(i,1);
          }
      }

      for (var i = 0; i < arr.length; i += size)
      {
        newArr.push(arr.slice(i, i + size));
      }

      return newArr;
    }


    $scope.searchEventFilter = [];
    //select filter
    $scope.selectFilter = function (elementId)
    {
    var elementClass = document.getElementById(elementId).className;
      if(elementClass == "eoko-horizontal-scroll-button eoko-text-thin activated" || elementClass == "eoko-horizontal-scroll-button eoko-text-thin ng-binding activated")
      {
        document.getElementById(elementId).className = "eoko-horizontal-scroll-button-selected eoko-text-thin";
        $scope.searchEventFilter.push(elementId);
      }else{
        document.getElementById(elementId).className = "eoko-horizontal-scroll-button eoko-text-thin";
        for(var i in $scope.searchEventFilter)
        {
          if($scope.searchEventFilter[i] == elementId)
          {
                $scope.searchEventFilter.splice(i, 1);
          }
        }
      }


      if($scope.searchEventFilter == [])
      {
        $scope.searchEventFilter = null;
      }
      console.log("searching",$scope.searchEventFilter)
    };



      $scope.customEventFilter = function(item)
      {
        for(var i in $scope.searchEventFilter)
        {
          for (var j in item.info.category)
          {
            if(item.info.category[j] == $scope.searchEventFilter[i])
            {
              return item;
            }
          }

        }
        if($scope.searchEventFilter.length == 0)
        {
          return item;
        }
      };


    $scope.selectCategory = function (elementId){
    var elementClass = document.getElementById(elementId).className;
      if(elementClass == "eoko-horizontal-scroll-button eoko-text-thin activated" || elementClass == "eoko-horizontal-scroll-button eoko-text-thin ng-binding activated"){
        document.getElementById(elementId).className = "eoko-horizontal-scroll-button-selected eoko-text-thin";
        $scope.event.category.push(elementId);
      }else{
        document.getElementById(elementId).className = "eoko-horizontal-scroll-button eoko-text-thin";
        for(var i in $scope.event.category)
        {
          if($scope.event.category[i] == elementId)
          {
                $scope.event.category.splice(i, 1);
          }
        }
      }

    };


    function checkUser(item) {
      var removeit = true;
      if(item.puborpriv == "public")
      {
        return true;
      }
      for (var i in item.rolecall) {
        if (i == authUser.uid) {
          console.log("FOUND!")
          return true;
          break;
        }
      }
      if (removeit === true) {
        return false;
      }

    }


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
      for (i in $scope.modalOpen.info.rolecall) {
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

    $scope.openPopover = function (event, notify) {
      $scope.blurry.behind = "5px";
      $scope.modalOpen = {
        info: notify.info,
        key: notify.key,
        attend: notify.attend
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
      ref.child(notify.key + "/rolecall/" + authUser.uid).set({
        'going': true
      }).then(function () {
        $scope.closePopover();
      });
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

    //hide bottom tab when create part is open
    //document.getElementById("tabsController-tabs1").style.background = "rgba(255, 255, 255, 0.4)";
    //#page6 > ion-content > ion-scroll
    //tabsController-tabs1

     $scope.nKeyboardActive = true;

    window.addEventListener('native.keyboardshow', keyboardShowHandler);
    function keyboardShowHandler(e){
       //showAlert('Keyboard height is: ' + e.keyboardHeight);
        document.querySelector("#tabsController-tabs1 > div").style.display = "none";
        document.querySelector("#page6 > ion-content > ion-scroll").style.height = "calc(100% - 3.5em)";
        $scope.nKeyboardActive = false;
        $timeout(function(){$scope.$apply();});



        //document.querySelector("#page6 > ion-content > ion-scroll.scroll-view.ionic-scroll.scroll-y").style.height = "calc(100% - 6.5em)";
    }

    window.addEventListener('native.keyboardhide', keyboardHideHandler);
    function keyboardHideHandler(e){
       //showAlert('Keyboard height is: ' + e.keyboardHeight);
        document.querySelector("#tabsController-tabs1 > div").style.display = "flex";
        document.querySelector("#page6 > ion-content > ion-scroll").style.height = "calc(100% - 15.5em)";
        $scope.nKeyboardActive = true;
        $timeout(function(){$scope.$apply();});
        //document.querySelector("#page6 > ion-content > ion-scroll.scroll-view.ionic-scroll.scroll-y").style.height = "calc(100% - 15.5em);";
    }

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


//var writeAttend = data.val().rolecall[authUser.uid].going ? 'Joined' : 'Join';
    var refActivate = (function () {
      var executed = false;
      return function () {
        if (!executed) {
          executed = true;
          console.log("ACTIVATE REF!!!");

          var kek = firebase.database().ref("Buildings").child(usr.buildcode).child("Admin/tags");
            $scope.tagList = $firebaseArray(kek);
            $scope.tagList.$loaded().then(function(y)
            {
              console.log("taglist",$scope.tagList);
            });

          ref.on('child_added', function (data) {
            console.log("child_added triggered");
            //if()
            if (checkUser(data.val())) {
              if(data.val().rolecall == null || data.val().rolecall == undefined)
              {
                  $scope.notifications.push({
                info: data.val(),
                key: data.key,
                attend: 'Join'
              });
              }
              else
              {
                if(data.val().puborpriv == "public" && (data.val().rolecall[authUser.uid] == null || data.val().rolecall[authUser.uid] == undefined))
                {
                  $scope.notifications.push({
                info: data.val(),
                key: data.key,
                attend: 'Join'
              });
                }
                else
                {

                 $scope.notifications.push({
                info: data.val(),
                key: data.key,
                attend: data.val().rolecall[authUser.uid].going ? 'Joined' : 'Join'
              });
              }
              }

              $timeout(function(){$scope.$apply();});
            }
          });


          ref.on('child_changed', function (data) {
            console.log("child_changed triggered");
            var removeitem = true;
            for (var i in data.val().rolecall)   //iterate over rolecall
            {
              if (i == authUser.uid || data.val().puborpriv == "public")   //if user is in rolecall
              {
                removeitem = false;
                var additem = true;
                for (var i = 0; i < $scope.notifications.length; i++)   //check notification list
                {
                  if ($scope.notifications[i].key == data.key)  //if notification is there, do nothing
                  {
                    additem = false;
                    $scope.notifications[i].attend = data.val().rolecall[authUser.uid].going ? 'Joined' : 'Join';
                    $scope.notifications[i].info = data.val();
                    console.log("checking attend:", $scope.notifications[i].attend);
                    break;
                  }
                }
                if (additem === true)   //if not, push to notification stack
                {
                  $scope.notifications.push({
                    info: data.val(),
                    key: data.key,
                    attend: data.val().rolecall[authUser.uid].going ? 'Joined' : 'Join'
                  });
                  break;
                }
                break;
              }
            }
            if (removeitem === true)   //if user is not in rolecall
            {
              for (var i = 0; i < $scope.notifications.length; i++)  //check notification list
              {
                if ($scope.notifications[i].key == data.key)      //if notification found, delete it
                {
                  $scope.notifications.splice(i, 1);
                  $timeout(function() {
                    $scope.$apply();
                  });
                  break;
                }
              }
            }
            $timeout(function () {
              $scope.$apply();
            });

          });

          ref.on('child_removed', function (data) {
            console.log("child_removed triggered");
            for (var i = 0; i < $scope.notifications.length; i++) {
              if ($scope.notifications[i].key == data.key) {
                $scope.notifications.splice(i, 1);
                $timeout(function () {
                  $scope.$apply();
                });
                break;
              }
            }
          });
        }
      };

    })();


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


    function chunk(arr, size) {
      var newArr = [];
      for (var i = 0; i < arr.length; i += size) {
        newArr.push(arr.slice(i, i + size));
      }
      return newArr;
    }

    $scope.selectEventTab = function () {
      document.getElementById("EventButton").className = "eoko-button-text-selected eoko-text-button-nav";
      document.getElementById("CreateEventButton").className = "eoko-button-text eoko-text-button-nav";
      $scope.selection.tab = "event";
      $scope.searchEventFilter = [];
    };

    $scope.selectCreateTab = function () {
      document.getElementById("EventButton").className = "eoko-button-text eoko-text-button-nav";
      document.getElementById("CreateEventButton").className = "eoko-button-text-selected eoko-text-button-nav";
      $scope.selection.tab = "create";
    };


    $scope.selectedPublic = function () {
      document.getElementById("PublicButton").className = "button button-energized button-block eoko-text-light";
      document.getElementById("PrivateButton").className = "button button-energized button-block button-outline eoko-text-light";
      $scope.selection.porb = "public";
    };

    $scope.selectedPrivate = function () {
      document.getElementById("PublicButton").className = "button button-energized button-block button-outline eoko-text-light";
      document.getElementById("PrivateButton").className = "button button-energized button-block eoko-text-light";
      $scope.selection.porb = "private";
      $scope.selection.privstep = 1;
    };

    $scope.PrivateNextStep = function () {
      $scope.selection.privstep = 2;

      var req = firebase.database().ref("Buildings").child(usr.buildcode + "/Users");
      $scope.owning = {avatar: usr.avatar};
      $scope.userList = $firebaseArray(req);

      $scope.userList.$loaded().then(function (x) {
        $scope.userList = chunk(x, 3);
        console.log($scope.userList);
      })
        .catch(function (error) {
          console.log("Error:", error);
        });
    };

    $scope.privateRoll = {};
    $scope.selectUser = function (selected) {
      $scope.privateRoll[authUser.uid] = {'going': false};
      if (selected.$id in $scope.privateRoll) {
        delete $scope.privateRoll[selected.$id];
      }
      else {
        $scope.privateRoll[selected.$id] = {'going': false};
      }

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

    $scope.createEvent = function (makeEventForm) {
      var rec = firebase.database().ref("Buildings").child(usr.buildcode + "/Users");
      var postedEvent = {
        category: $scope.event.category,
        title: $scope.event.title,
        location: $scope.event.location,
        date: "",
        time: "",
        puborpriv: "",
        description: $scope.event.description,
        avatar: usr.avatar,
        creatorID: authUser.uid,
        name: usr.name
      };

      if($scope.event.category == "" || $scope.event.category == " ")
      {
        showAlert("You must select at least one category.");
        console.log("gotta add something");
        return;
      }

      var d = $scope.event.date;
      postedEvent.date = weekday[d.getDay()] + ", " + month[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
      postedEvent.time = $scope.event.time.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
      console.log(postedEvent);


//if public

      if ($scope.selection.porb == "public") {
        var everyone = $firebaseArray(rec);
        everyone.$loaded().then(function (x) {
          var rolecall = {};
          /*for (var i = 0; i < everyone.length; i++) {
            rolecall[everyone[i].$id] = {'going': false};
          }*/
          var eventpost = ref.push({
            'category': $scope.event.category,
            'title': postedEvent.title,
            'location': postedEvent.location,
            'date': postedEvent.date,
            'time': postedEvent.time,
            'puborpriv': "public",
            'description': postedEvent.description,
            'avatar': postedEvent.avatar,
            //'rolecall': rolecall,
            'name' : postedEvent.name
          });

          /*rec.child(authUser.uid + "/notifications").push({
            'category': $scope.event.category,
            'title': postedEvent.title,
            'location': postedEvent.location,
            'date': postedEvent.date,
            'time': postedEvent.time,
            'puborpriv': "public",
            'description': postedEvent.description,
            'avatar': postedEvent.avatar,
            //'rolecall': rolecall,
            'name' : postedEvent.name
          });*/

          rec.child(authUser.uid + "/yourEvents").push({
            'category': $scope.event.category,
            'title': postedEvent.title,
            'location': postedEvent.location,
            'date': postedEvent.date,
            'time': postedEvent.time,
            'puborpriv': "public",
            'description': postedEvent.description,
            'avatar': postedEvent.avatar,
            //'rolecall': rolecall,
            'name' : postedEvent.name
          });

          rec.child(authUser.uid + "/eventCount").transaction(function (counts) {
            if (counts) {
              counts = counts + 1;
            }
            return (counts || 0) + 1;
          });

        })
          .catch(function (error) {
            console.log("Error:", error);
          });


        $scope.selection.tab = "event";
      }
//if private
      else if ($scope.selection.porb == "private") {

        if(!(Object.keys($scope.privateRoll).length > 0))
        {
          showAlert("You must select at least one person.");
          return false;
        }

        var eventpost = ref.push({
          'category': $scope.event.category,
          'title': postedEvent.title,
          'location': postedEvent.location,
          'date': postedEvent.date,
          'time': postedEvent.time,
          'puborpriv': "private",
          'description': postedEvent.description,
          'avatar': postedEvent.avatar,
          'rolecall': $scope.privateRoll,
            'name' : postedEvent.name
        });


        rec.child(authUser.uid + "/notifications").push({
          'category': $scope.event.category,
          'title': postedEvent.title,
          'location': postedEvent.location,
          'date': postedEvent.date,
          'time': postedEvent.time,
          'puborpriv': "private",
          'description': postedEvent.description,
          'avatar': postedEvent.avatar,
          'rolecall': $scope.privateRoll,
            'name' : postedEvent.name
        });

        rec.child(authUser.uid + "/yourEvents").push({
          'category': $scope.event.category,
          'title': postedEvent.title,
          'location': postedEvent.location,
          'date': postedEvent.date,
          'time': postedEvent.time,
          'puborpriv': "private",
          'description': postedEvent.description,
          'avatar': postedEvent.avatar,
          'rolecall': $scope.privateRoll,
            'name' : postedEvent.name
        });

        rec.child(authUser.uid + "/eventCount").transaction(function (counts) {
          if (counts) {
            counts = counts + 1;
          }
          return (counts || 0) + 1;
        });

        $scope.selection.tab = "event";
        $scope.selection.privstep = 1;
      }

    };


  }])
