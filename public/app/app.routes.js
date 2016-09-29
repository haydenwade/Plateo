plateoApp.config(function($routeProvider, $httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');

    $routeProvider
        .when('/', {
            templateUrl: 'app/components/home/home.html',
            controller: 'mainController',
            access: {
                requiredLogin: false
            }
        })
        .when('/plateSearch', {
            templateUrl: 'app/components/search/plateSearch.html',
            controller: 'searchController',
            access: {
                requiredLogin: false
            }
        })
        .when('/myPlates', { //TODO: this requires login, other views that have follow buttons should use ng-if="loggedIn"
            templateUrl: 'app/components/myPlates/myPlates.html',
            controller: 'myPlatesController',
            access: {
                requiredLogin: true
            }
        })
        .when('/plate', { //TODO: pass plate obj as parameter
          templateUrl: 'app/components/plate/plate.html',
          controller: 'plateController',
          access: {
              requiredLogin: false
          }
      })
      .when('/login', {
            templateUrl: 'app/shared/login/login.html',
            controller: 'loginController',
            access: {
                requiredLogin: false
            }
        })
        .when('/register', {
            templateUrl: 'app/shared/register/register.html',
            controller: 'loginController', //TODO: split controllers
            access: {
                requiredLogin: false
            }
        })
});
