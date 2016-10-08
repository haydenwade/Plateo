plateoApp.controller('myPlatesController', function($scope, $location, plateService) {
    var vm = $scope;
    vm.plateClicked = function(plate) {
        $location.path('plate/' + plate._id);
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
