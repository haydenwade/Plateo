var jwt = require('jwt-simple');
var usersManager = require('../routes/users.js');

module.exports = function(req, res, next) {

    var token = req.headers['x-access-token'];
    var expires = req.headers['expires'];

    if (token) {
        try {
            var decoded = jwt.decode(token, require('./secret.js')());
            if (expires <= Date.now()) { //authentication
                res.status(400);
                res.json({
                    "status": 400,
                    "message": "Token Expired"
                });
                return;
            }

            //authorization - if user in db
            usersManager.doesUsernameExist(decoded.user, function(resp) {
                if (resp.doesExist) {
                    if (req.url.indexOf('/api/v1/') >= 0) { //TODO: whats this do?
                        next(); // To move to next middleware
                    } else {
                        res.status(403);
                        res.json({
                            "status": 403,
                            "message": "Not Authorized"
                        });
                        return;
                    }
                } else {
                    // No user with this name exists, respond back with a 401
                    res.status(401);
                    res.json({
                        "status": 401,
                        "message": "Invalid User"
                    });
                    return;
                }
            });

        } catch (err) {
            res.status(500);
            res.json({
                "status": 500,
                "message": "Oops something went wrong",
                "error": err
            });
        }
    } else {
        res.status(401);
        res.json({
            "status": 401,
            "message": "Invalid Token or Key"
        });
        return;
    }
};
