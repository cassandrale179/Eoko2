// Ionic Eoko App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'eoko' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'eoko.services' is found in services.js
// 'eoko.controllers' is found in controllers.js

angular.module('eoko', ['ionic', 'ionicUIRouter', 'eoko.controllers', 'eoko.services', 'eoko.directives',
'ionic.ion.imageCacheFactory', 'ionic-native-transitions', 'ngCordova', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

//Config firebase API
//******************************/
//NOTE: I CHANGED DATABASE RULE FOR READ AND WRITE TO TRUE FOR NOW. MAKE SURE TO UPDATE IT LATER ON
//******************************/
.config(function() {
  var config = {
    apiKey: "AIzaSyCxi6Eah3dgixKG8oFO8DB6sMVN1v3mxuQ",
    authDomain: "eoko-cc928.firebaseapp.com",
    databaseURL: "https://eoko-cc928.firebaseio.com",
    projectId: "eoko-cc928",
    storageBucket: "",
    messagingSenderId: "652695448822"
  };
  firebase.initializeApp(config);
})


//Config app states
.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
    url: '/loginPage',
    nativeTransitions: {
      type: "fade"
    },
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('tabsController.events', {
    url: '/EventPage',
    nativeTransitions: {
      type: "fade"
    },
    views: {
      'tab2': {
        templateUrl: 'templates/events.html',
        controller: 'eventsCtrl'
      }
    }
  })

  .state('tabsController.notifications', {
    url: '/notificationPage',
    nativeTransitions: {
      type: "fade"
    },
      views: {
      'tab1': {
        templateUrl: 'templates/notificationPage.html',
      controller: 'notificationPageCtrl'
      }
    }
  })


  .state('tabsController.connect', {
    url: '/connectPage',
    nativeTransitions: {
      type: "fade"
    },
    views: {
      'tab3': {
        templateUrl: 'templates/connect.html',
        controller: 'connectCtrl'
      }
    }
  })

  .state('tabsController.buildingEvents', {
    url: '/buildingEventsPage',
    nativeTransitions: {
      type: "fade"
    },
    views: {
      'tab4': {
        templateUrl: 'templates/buildingEvents.html',
        controller: 'buildingEventsCtrl'
      }
    }
  })

  .state('tabsController.info', {
    url: '/infoPage',
    nativeTransitions: {
      type: "fade"
    },
    views: {
      'tab5': {
        templateUrl: 'templates/info.html',
        controller: 'infoCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    nativeTransitions: {
      type: "fade"
    },
    templateUrl: 'templates/tabsController.html',
    abstract: true
  })

  .state('home', {
    url: '/homePage',
    nativeTransitions: {
      type: "fade"
    },
    templateUrl: 'templates/home.html',
    controller: 'homeCtrl'
  })

  .state('profile', {
    url: '/profilePage',
    nativeTransitions: {
      type: "fade"
    },
    params: {
      'avatarClicked': 'false'
    },
    templateUrl: 'templates/profile.html',
    controller: 'profileCtrl'
  })

  .state('signup', {
    url: '/signupPage',
    nativeTransitions: {
      type: "fade"
    },
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })



  .state('getNamePage', {
    url: '/namePage',
    nativeTransitions: {
      type: "fade"
    },
    templateUrl: 'templates/getNamePage.html',
    controller: 'getNamePageCtrl'
  })

  .state('getCodePage', {
    url: '/codePage',
    nativeTransitions: {
      type: "fade"
    },
    params: {
      userinfo: {firstname: "", lastname: "", email: "", password: "", buildcode: ""}
    },
    templateUrl: 'templates/getCodePage.html',
    controller: 'getCodePageCtrl'
  })

  .state('getDescriptionPage', {
    url: '/descriptionPage',
    nativeTransitions: {
      type: "fade"
    },
    templateUrl: 'templates/getDescriptionPage.html',
    controller: 'getDescriptionPageCtrl'
  })

  .state('getSocialPage', {
    url: '/socialPage',
    nativeTransitions: {
      type: "fade"
    },
    templateUrl: 'templates/getSocialPage.html',
    controller: 'getSocialPageCtrl'
  })

  .state('getPicturePage', {
    url: '/picturePage',
    nativeTransitions: {
      type: "fade"
    },
    templateUrl: 'templates/getPicturePage.html',
    controller: 'getPicturePageCtrl'
  })

  .state('chatTab', {
    url: '/chatTab',
    nativeTransitions: {
      type: "fade"
    },
    templateUrl: 'templates/chatTab.html',
    controller: 'chatTabCtrl'
  })

  .state('chatPage', {
    url: '/chatPage',
    nativeTransitions: {
      type: "fade"
    },
    params: {
      otherID: "",
      convoID: ""
    },
    templateUrl: 'templates/chatPage.html',
    controller: 'chatPageCtrl'
  })

  .state('settingPage', {
    url: 'settingPage',
    nativeTrasitions: {
      type: "fade"
    },
    templateUrl: 'templates/setting.html',
    controller: 'settingPageCtrl'
  })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/loginPage');

});
