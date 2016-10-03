plateoApp.controller('myPlatesController', function($scope, $location, plateService) {
    var vm = $scope;
    vm.plateClicked = function(plate) {
        plateService.plateChoosen(plate); //NOTE: no promise needed, just passing data between controllers
        $location.path('plate');
    };

    var getMyPlatesPromise = plateService.getMyPlates();
    getMyPlatesPromise.then(function(response) {
      if(response.data){
        vm.myPlates = response.data;
      }
      else{
        vm.myPlates = [];
      }
    }, function(response) {
        alert('Error happened getting my plates: ', JSON.stringify(response)); //TODO: appropriate error handling toastr, maybe
    });
});
