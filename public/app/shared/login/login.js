plateoApp.controller('loginController', function($scope, $window, $location, UserAuthFactory, AuthenticationFactory, userService) {
      $scope.user = {
          username: '',
          password: '', //pass123 - bobmarley
          verifypassword: '',
          email: '',
          firstname: '',
          lastname: ''
      };
      $scope.errorMessage = '';
      $scope.keyPress = function (keyCode) {
          if (keyCode == 13)
              $scope.login();
      };
      $scope.login = function () {

          var username = $scope.user.username,
              password = $scope.user.password;
          $scope.errorMessage = ''; //clears the error message when they go to try for second time

          if (username !== '' && password !== '') {
              UserAuthFactory.login(username, password).success(function (data) {

                  AuthenticationFactory.isLogged = true;
                  AuthenticationFactory.user = data.user;
                  AuthenticationFactory.userRole = data.user.role;

                  $window.localStorage.token = data.token;
                  $window.localStorage.user = data.user.username; // to fetch the user details on refresh
                  $window.localStorage.userRole = data.user.role; // to fetch the user details on refresh
                  userService.setCurrentUser(data.user);
                  $location.path("/plateSearch");

              }).error(function (status) {
                  if (status.message == "Invalid credentials!") {
                      $scope.errorMessage = "Looks like we couldn't find a username associated with that password, please try again.";
                  } else
                      $scope.errorMessage = status.message;
              });
          } else {
              if (password == '' && username !== '')
                  $scope.errorMessage = 'Make sure to enter your password';
              else if (username == '' && password !== '')
                  $scope.errorMessage = 'Make sure to enter your username';
          }

      };

      $scope.register = function () {
          var username = $scope.user.username,
              password = $scope.user.password,
              verifyPassword = $scope.user.verifypassword,
              email = $scope.user.email,
              firstname = $scope.user.firstname,
              lastname = $scope.user.lastname;

          $scope.errorMessage = ''; //clears the error message when they go to try for second time

          if (password == verifyPassword) {
              if (username !== '' && password !== '' && firstname !== '' && lastname !== '' && email !== undefined) {
                  UserAuthFactory.register(firstname, lastname, email, username, password).success(function (data) {
                      $scope.login();
                  }).error(function (status) {
                      $scope.errorMessage = 'Oops look like we messed something up, please try again ';
                      if (status !== null) {
                        $scope.errorMessage += status.message;
                      }
                  });
              } else {
                  $scope.errorMessage = 'Make sure to fill everything in, cheers!';
              }
          } else {
              $scope.errorMessage = "Passwords don't match, please try again";
          }
      };
});
