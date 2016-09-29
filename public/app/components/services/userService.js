plateoApp.service('userService', function() {
    var currentUser; //FIXME: Check to see if this is good practice to share across controllers, if not remove all references(getter, setter)
    return {
        setCurrentUser: function(user) {
            currentUser = user;
        },
        getCurrentUser: function() {
            return currentUser;
        }
    };
});
