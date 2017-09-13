angular.module('eoko.services', [])

  .factory('UserInfo', [function () {
    var userData = {
      email: "",
      uid: "",
      name: "",
      birthday: "",
      friendsList: ""
    };

    return {
      setUserInfo: function (info) {
        userData = {
          uid: info.uid,
          name: info.name,
          email: info.email,
          birthday: info.birthday,
          imageUrl: info.imageUrl,
          token: info.token
        };
        return true;
      },

      getUserInfo: function () {
        return userData;
      }
    };

  }])


  .factory('OtherInfo', [function () {
    var userData = {
       id:"",
      name: "",
      email: "",
      birthday: "",
      points: 0,
      eventCount: 0,
      surveyCount: 0,
      major: "",
      avatar: "",
      buildcode: "",
      description: "",
      friendlist: []
    };

    return {
      setOtherInfo: function (info) {
        userData = {
           id: info.$id,
          name: info.name,
          email: info.email,
          birthday: info.birthday,
          points: info.points,
          eventCount: info.eventCount,
          surveyCount: info.surveyCount,
          major: info.major,
          avatar: info.avatar,
          buildcode: info.buildcode,
          description: info.description,
          friendlist: info.friendlist
        };
        return true;
      },

      getOtherInfo: function () {
        return userData;
      }
    };

  }])


   .factory('ProfilePress', [function () {
    var aprofile = false;

    return {
      setState: function (info) {
        aprofile = info;
        return true;
      },

      getState: function () {
        return aprofile;
      }
    };

  }])






  .service('BlankService', [function () {

  }]);
