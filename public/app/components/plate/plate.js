plateoApp.controller('plateController', function($scope, $routeParams, plateService, AuthenticationFactory) {
    var vm = $scope;
    vm.comments = [];
    vm.initialize = function() {
        var getPlateServicePromise = plateService.getPlate($routeParams.id);
        getPlateServicePromise.then(function(response){
          vm.plate = response;
          updateIsFollowing();
          var getCommentsPromise = plateService.getComments(vm.plate._id);
          getCommentsPromise.then(function(response){
              vm.comments = response;
          }, function(response){
            alert('Error happened getting comments: ', JSON.stringify(response));//TODO: appropriate error handling toastr, maybe
          });
      }, function(error){
        alert('Error happend getting plate: ', JSON.stringify(error));
      });
    };
    vm.follow = function() {
        plateService.follow(vm.plate._id).then(function(response) {
            vm.isFollowing = !vm.isFollowing;
        }, function(response) {
            alert('Error occurred trying to follow plate: ', JSON.stringify(response)); //TODO: handle error appro.
        });
    };
    vm.addComment = function() {
      if(vm.newComment !== ''){
        const plate = vm.plate;
        const comment = vm.newComment;

        var addCommentPromise = plateService.addComment(vm.plate._id, comment);
        addCommentPromise.then(function(response) {
            var getCommentsPromise = plateService.getComments(vm.plate._id);
            getCommentsPromise.then(function(response){
                vm.comments = response;
            }, function(response){
              alert('Error happened getting comments: ', JSON.stringify(response));//TODO: appropriate error handling toastr, maybe
            });
            vm.newComment="";
        }, function(response) {
            alert('Error happened adding comment on plate: ', JSON.stringify(response)); //TODO: appropriate error handling toastr, maybe
        });
      }
    };
    var updateIsFollowing = function (){
      var getIsFollowingPromise = plateService.getIsUserFollowing(AuthenticationFactory.user._id, vm.plate._id);
      getIsFollowingPromise.then(function(response){
          vm.isFollowing = response.isFollowing ? response.isFollowing : false;
      }, function(response){
        alert('Error happened when checking if user follows.');
      });
    };
    vm.initialize();
});
