plateoApp.controller('plateController', function($scope, plateService) {
    var vm = $scope;
    vm.comments = [];
    vm.initialize = function() {
        vm.plate = plateService.getPlateToShow(); //NOTE: no promises needed because it doesn't call api
        var getCommentsPromise = plateService.getComments();
        getCommentsPromise.then(function(response){
            vm.comments = response;
        }, function(response){
          alert('Error happened getting comments: ', JSON.stringify(response));//TODO: appropriate error handling toastr, maybe
        });
    }
    vm.follow = function() {
        plateService.follow().then(function(response) {}, function(response) {
            alert('Error occurred trying to follow plate: ', JSON.stringify(response)); //TODO: handle error appro.
        });
    };
    vm.addComment = function() {
      if(vm.newComment !== ''){
        const plate = vm.plate;
        const comment = vm.newComment;

        var addCommentPromise = plateService.addComment(comment);
        addCommentPromise.then(function(response) {
        //   var getCommentsPromise = plateService.getComments();
        //   getCommentsPromise.then(function(response){
        //       vm.comments = response;
        //   }, function(response){
        //     alert('Error happened getting comments: ', JSON.stringify(response));//TODO: appropriate error handling toastr, maybe
        //   });
        //     vm.newComment = "";
        // }, function(response) {
        //     alert('Error happened adding comment on plate: ', JSON.stringify(response)); //TODO: appropriate error handling toastr, maybe
        // });
        vm.newComment="";
      });
      }
    }
    vm.initialize();
});
