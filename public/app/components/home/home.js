plateoApp.controller('mainController', function($scope, $location, UserAuthFactory) {
    var vm = $scope;
    vm.isActive = function (route) {
            return route === $location.path();
        };

    vm.logout = function () {
        UserAuthFactory.logout();
    };
});
