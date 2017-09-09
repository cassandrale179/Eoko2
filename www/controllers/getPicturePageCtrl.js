app.controller('getPicturePageCtrl', ['$scope', '$stateParams', '$state', '$timeout','$cordovaCamera', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
  function ($scope, $stateParams, $state, $timeout,$cordovaCamera) {

    $scope.user = {image: "https://firebasestorage.googleapis.com/v0/b/mycommunity-a33e4.appspot.com/o/default-avatar.png?alt=media&amp;token=39dc28f9-e9c1-404e-98f1-8266dda61bb2"};

    function b64toBlob(b64Data, contentType, sliceSize) { //blobs galore
      contentType = contentType || '';
      sliceSize = sliceSize || 512;

      var byteCharacters = atob(b64Data);
      var byteArrays = [];

      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
      }

      var blob = new Blob(byteArrays, {
        type: contentType
      });
      return blob;
    }


    var randID = "";

    $scope.uploadPic = function () {
      console.log("upload picture");

      var options = {
        quality: 75,
        destinationType: 0, //URL = 0, URI = 1;
        sourceType: 0,
        allowEdit: true,
        encodingType: 0,
        targetWidth: 500,
        targetHeight: 500,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {
        console.log(imageData);
        var contentType = 'image/jpeg';
        var blob = b64toBlob(imageData, contentType);
        console.log("a new blob, ", blob);
        console.log("blobs URL, ", $scope.user.image);

        randID = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
        firebase.storage().ref().child('profilePics/' + randID + ".jpg").put(blob).then(function (snapshot) {
          console.log('Uploaded a blob !');
          $scope.user.image = snapshot.downloadURL;
          $timeout(function () {$scope.$apply();});
        });


      });
    };

    $scope.$on('$ionicView.beforeEnter', function () //before anything runs
    {
      var usr = firebase.auth().currentUser;
      var ref = firebase.database().ref("Buildings").child(usr.displayName + "/Users");
      ref.child(usr.uid + "/avatar").set($scope.user.image, function (success) {
      });
    });

    $scope.submitAvatar = function () {
      usr = firebase.auth().currentUser;
      ref = firebase.database().ref("Buildings").child(usr.displayName + "/Users");
      ref.child(usr.uid + "/avatar").set($scope.user.image, function (success) {
        $state.go('getDescriptionPage');
      });

    };
  }])
