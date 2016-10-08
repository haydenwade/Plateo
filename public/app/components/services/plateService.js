plateoApp.service('plateService2', function($resource, constants, AuthenticationFactory) {
  return $resource({

  });
});



plateoApp.service('plateService', function($q, $http, constants, AuthenticationFactory) {
  var baseUrl = constants.apis.plateoApiBaseUrl;
    return {
        getPlate: function(plateId){
          return $http.get(baseUrl + "plates/" + plateId).then(function(response) {
              return response.data[0];
          });
        },
        follow: function(plateId) {
          return $http({
              method: 'POST',
              url: baseUrl + 'api/v1/plates/follow',
              data: {
                  userId: AuthenticationFactory.user._id,
                  plateId: plateId,
                  createdDateTime : new Date()
              }
          }).then(function success(response) {
              return response;
          });
        },
        getIsUserFollowing : function(userId, plateId){
          return $http.get(baseUrl + "api/v1/plates/follow/" + userId + '/' + plateId).then(function(response) {
              return response.data;
          });
        },
        searchPlates: function(plateNum, state) { //TODO: Search Functionality
            return $http.get(baseUrl + "plates").then(function(response) {
                return response.data;
            });
        },
        getMyPlates: function() {
          return $http.get(baseUrl + 'api/v1/plates/' + AuthenticationFactory.user._id).then(function(response){return response;});
        },
        getComments: function(plateId) {
           return $http.get(baseUrl + "comments/" + plateId).then(function(response) {
              return response.data;
          });
        },
        addComment: function(plateId, comment) {
          return $http({
              method: 'POST',
              url: baseUrl + 'api/v1/plates/comment',
              data: {
                  plateId: plateId,
                  comment : comment,
                  user: {
                      userId: AuthenticationFactory.user._id,
                      username: AuthenticationFactory.user.username
                  },
                  createdDateTime : new Date()
              }
          }).then(function success(response) {
              return response;
          });
        },
        createPlate: function(plateNumber, state){
          return $http({
              method: 'POST',
              url: baseUrl + 'api/v1/plates',
              data: {
                  number: plateNumber,
                  state : state,
                  user: {
                      userId: AuthenticationFactory.user._id,
                      username: AuthenticationFactory.user.username
                  },
                  createdDateTime : new Date()
              }
          }).then(function success(response) {
              return response;
          });
        }
    };
});
