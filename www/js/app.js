// Ionic Eoko App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'eoko' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'eoko.services' is found in services.js
// 'eoko.controllers' is found in controllers.js

angular.module('eoko', ['ionic', 'ionicUIRouter', 'eoko.controllers', 'eoko.services', 'eoko.directives',
'ionic.ion.imageCacheFactory', 'ionic-native-transitions', 'ngInstafeed', 'ngCordova', 'ngCordovaOauth', 'firebase', 'socialLogin', 'ngOpenFB','angularRangeSlider'])

.run(function($ionicPlatform, ngFB) {
  ngFB.init({appId: '694354544087073'});
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
socialProvider.setFbKey({appId: "694354544087073", apiVersion: "v2.10"});
})



//Config app states
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider


  /* ---------- LOGIN PAGE ---------- */
  .state('login', {
    url: '/loginPage',
    nativeTransitions: {
      type: "fade"
    },
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  /* --------- JOIN LIST PAGE ------- */
    .state('joinList', {
      url: '/joinListPage',
      nativeTransitions: {
        type: "fade"
      },
      templateUrl: 'templates/joinList.html',
      controller: 'joinListCtrl'
    })


  /* --------- EVENT LIST PAGE ------- */
  .state('eventList', {
    url: '/eventListPage',
    nativeTransitions: {
      type: "fade"
    },
    templateUrl: 'templates/eventList.html',
    controller: 'eventListCtrl'
  })


  /* --------- ACTION LIST PAGE ------- */
  .state('actionList', {
    url: '/actionListPage',
    nativeTransitions: {
      type: "fade"
    },
    templateUrl: 'templates/actionList.html',
    controller: 'actionListCtrl'
  })

  /* --------- ACTION CREATE PAGE ------- */
  .state('actionCreate', {
    url: '/actionCreatePage',
    nativeTransitions: {
      type: "fade"
    },
    templateUrl: 'templates/actionCreate.html',
    controller: 'actionCreateCtrl'
  })


/* --------- SETTING PAGE ------- */
  .state('settingPage', {
    url: '/settingPage',
    nativeTransitions: {
      type: "fade"
    },
    templateUrl: 'templates/setting.html',
    controller: 'settingPageCtrl'
  })


    .state('messagePage', {
      url: '/messagePage',
      nativeTrasitions: {
        type: "fade"
      },
      params: {
          otherID: "",
          convoID: ""
        },
      templateUrl: 'templates/messagePage.html',
      controller: 'messagePageCtrl'
    })


    .state('chatTab', {
      url: '/chatTab',
      nativeTransitions: {
        type: "fade"
      },
      templateUrl: 'templates/chatTab.html',
      controller: 'chatTabCtrl'
    })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/loginPage');

});
