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

  /* ------- LOGIN PAGE CONTROLLER ------- */
  .state('login', {
    url: '/loginPage',
    nativeTransitions: {
      type: "fade"
    },
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

     .state('tabsController.eventList', {
       url: '/eventList',
       nativeTransitions: {
         type: "fade"
       },
       views: {
         'tab2': {
           templateUrl: 'templates/eventList.html',
          controller: 'eventListCtrl'
         }
       }
     })

     .state('tabsController.actionList', {
        url: '/actionList',
        nativeTransitions: {
          type: "fade"
        },
        views: {
          'tab3': {
            templateUrl: 'templates/actionList.html',
            controller: 'actionListCtrl'
          }
        }
      })

     .state('tabsController.chatTab', {
        url: '/chatTab',
        nativeTransitions: {
          type: "fade"
        },
        views: {
          'tab4': {
            templateUrl: 'templates/chatTab.html',
            controller: 'chatTabCtrl'
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


      /* ------- ACTION CREATE PAGE CONTROLLER ------- */
    .state('actionCreate', {
      url: '/actionCreate',
      nativeTransitions: {
        type: "fade"
      },
      params: {
        'avatarClicked': 'false'
      },
      templateUrl: 'templates/actionCreate.html',
      controller: 'actionCreateCtrl'
    })

      /* ------- ACTION LIST CONTROLLER ------- */


    .state('signup', {
      url: '/signupPage',
      nativeTransitions: {
        type: "fade"
      },
      templateUrl: 'templates/signup.html',
      controller: 'signupCtrl'
    })


    .state('settingPage', {
      url: '/settingPage',
      nativeTrasitions: {
        type: "fade"
      },
      templateUrl: 'templates/setting.html',
      controller: 'settingPageCtrl'
    })



  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/loginPage');

});
