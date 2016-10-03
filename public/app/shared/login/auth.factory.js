plateoApp.factory('AuthenticationFactory', function ($window) {
    var auth = {
        isLogged: false,
        check: function () {
          console.log('Checking the magic!');
            if ($window.localStorage.token && $window.localStorage.user) {
                this.isLogged = true;
                this.user = $window.localStorage.user;
            } else {
                this.isLogged = false;
                delete this.user;
            }
        }
    }
    return auth;
});

plateoApp.factory('UserAuthFactory', function ($window, $location, $http, constants, AuthenticationFactory) {
  var baseUrl = constants.apis.plateoApiBaseUrl;
    return {
        login: function (username, password) {
            return $http.post(baseUrl + 'login', {
                username: username,
                password: password
            });
        },
        logout: function () {
            if (AuthenticationFactory.isLogged) {
                AuthenticationFactory.isLogged = false;
                delete AuthenticationFactory.user;
                delete AuthenticationFactory.userRole;
                delete $window.localStorage.token;
                delete $window.localStorage.expires;
                delete $window.localStorage.user;
                delete $window.localStorage.userRole;

                $location.path("/login");
            }
        },
        register: function (firstname, lastname, email, username, password) { //TODO: create user object to pass not individual attributes
            return $http.post(baseUrl + 'register', {
                firstname: firstname,
                lastname: lastname,
                email: email,
                username: username,
                password: password,
                verifyPassword: password
            });
        }
    }
});
plateoApp.factory('TokenInterceptor', function ($q, $window) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            // Set the headers for auth based endpoints
            if ($window.localStorage.token) {
                config.headers['X-Access-Token'] = JSON.parse(localStorage.getItem('token')),
                config.headers['Expires'] = localStorage.getItem('expires'),
                config.headers['Content-Type'] = "application/json";
            }
            return config || $q.when(config);
        },
        response: function (response) {
            return response || $q.when(response);
        }
    };
});
