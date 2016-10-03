plateoApp.service('plateService2', function($resource, constants, AuthenticationFactory) {
  return $resource({

  });
});



plateoApp.service('plateService', function($q, $http, constants, userService, AuthenticationFactory) {
  var baseUrl = constants.apis.plateoApiBaseUrl;
  var plateToShow = {}; //FIXME: Check to see if this is good practice to share across controllers, if not remove all references(getter, setter)
    return {
        plateChoosen: function(plate) {
            console.log('setting plate', plate);
            plateToShow = plate;
        },
        getPlateToShow: function() {
            return plateToShow;
        },
        follow: function() {
          return $http({
              method: 'POST',
              url: baseUrl + 'api/v1/plates/follow',
              data: {
                  userId: AuthenticationFactory.user._id,
                  plateId: plateToShow._id,
                  createDateTime : new Date()
              }
          }).then(function success(response) {
              return response;
          });
        },
        searchPlates: function(plateNum, state) { //TODO: Search Functionality
            return $http.get(baseUrl + "plates").then(function(response) {
                return response.data;
            });
        },
        getMyPlates: function() {
          console.log(AuthenticationFactory.user);//AuthenticationFactory.user._id,
          return $http.get(baseUrl + 'api/v1/plates/' + 7).then(function(response){return response;});
        },
        getComments: function() {
           return $http.get(baseUrl + "comments/" + plateToShow._id).then(function(response) {
              return response.data;
          });
        },
        addComment: function(comment) {
          return $http({
              method: 'POST',
              url: baseUrl + 'api/v1/plates/comment',
              data: {
                  plateId: plateToShow._id,
                  comment : comment,
                  user: {
                      userId: AuthenticationFactory.user._id,
                      username: AuthenticationFactory.user.username
                  },
                  createDateTime : new Date()
              }
          }).then(function success(response) {
              return response;
          });
        }
    };
});
