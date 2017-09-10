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

.config(function(socialProvider){
socialProvider.setFbKey({appId: "119015562095866", apiVersion: "v2.10"});
})



//Config app states
.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
    url: '/login',
    nativeTransitions: {
      type: "fade"
    },
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })


  //home page. each tab
  .state('tabsController', {
    url: '/home',
    nativeTransitions: {
      type: "fade"
    },
    templateUrl: 'templates/tabsController.html',
    abstract: true
  })

  .state('tabsController.notifications', {
    url: '/notification',
    nativeTransitions: {
      type: "fade"
    },
      views: {
      'tab1': {
        templateUrl: 'templates/notification.html',
      controller: 'notificationCtrl'
      }
    }
  })

  .state('tabsController.action', {
    url: '/action',
    nativeTransitions: {
      type: "fade"
    },
    views: {
      'tab2': {
        templateUrl: 'templates/actions.html',
        controller: 'actionsCtrl'
      }
    }
  })

  .state('tabsController.people', {
    url: '/people',
    nativeTransitions: {
      type: "fade"
    },
    views: {
      'tab3': {
        templateUrl: 'templates/people.html',
        controller: 'peopleCtrl'
      }
    }
  })

  .state('tabsController.chat', {
    url: '/chat',
    nativeTransitions: {
      type: "fade"
    },
    views: {
      'tab4': {
        templateUrl: 'templates/chat.html',
        controller: 'chatCtrl'
      }
    }
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
    templateUrl: 'templates/chatTab.html',
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
  $urlRouterProvider.otherwise('/login');

});
