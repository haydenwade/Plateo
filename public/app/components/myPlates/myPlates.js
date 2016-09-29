plateoApp.controller('myPlatesController', function($scope, $location, plateService) {
    var vm = $scope;
    vm.plateClicked = function(plate) {
        plateService.plateChoosen(plate); //NOTE: no promise needed, just passing data between controllers
        $location.path('plate');
    };

    var getMyPlatesPromise = plateService.getMyPlates();
    getMyPlatesPromise.then(function(response) {
        vm.myPlates = response;
    }, function(response) {
        //alert('Error happened getting my plates: ', JSON.stringify(response)); //TODO: appropriate error handling toastr, maybe
    });
});
