var jwt = require('jwt-simple');
var MongoClient = require('mongodb').MongoClient;
var constants = require('../constants.js');
var userManager = require('./users.js');

var auth = {
    login: function(req, res) {
      console.log('Logging in...');
        var username = req.body.username || '';
        var password = req.body.password || '';

        if (username !== '' || password !== '') {
            areCredentialsValid(username, password, function(result) {
                if (result) {
                  userManager.getUser(username, function(resp){
                    if(resp.status !== 401){
                      console.log('Logging in finished.');
                      var token = genToken(username);
                      res.json({
                          token: token.token,
                          expires: token.expires,
                          user: resp,
                          message: 'login success'
                      });
                    }
                    else{
                      res.status(401);
                      res.json(resp);
                    }
                  });

                } else {
                    res.status(401);
                    res.json({
                        status: 401,
                        message: 'Invalid credentials!!'
                    });
                }
            });
        } else {
            res.status(401);
            res.json({
                status: 401,
                message: 'Invalid credentials!!'
            });
        }
    },
    register: function(req, res) {
      console.log('Registering...');
        var userAccountInfo = req.body;
        if (userAccountInfo.email.indexOf('@') > -1 && userAccountInfo.email.indexOf('.com') > -1) { //TODO: validate that it is a valid email
            if (userAccountInfo.password === userAccountInfo.verifyPassword) {
                if (userAccountInfo.password.length >= 6) { //TODO: what else do I want to check length and contains upper and lower and special char
                    userManager.createUser(userAccountInfo, function(resp){
                      if(resp.status !== 401){
                        console.log('Registering finished.');
                        res.json({
                            token: genToken(userAccountInfo.username),
                            message: 'register success'
                        });
                      }
                      else{
                        res.status(401);
                        res.json(resp);
                      }
                    });

                } else {
                    res.status(401);
                    res.json({
                        status: 401,
                        message: 'Make sure your password is at least 6 characters long.'
                    });
                }
            } else {
                res.status(401);
                res.json({
                    status: 401,
                    message: 'Passwords do not match.'
                });
            }
        } else {
            res.status(401);
            res.json({
                status: 401,
                message: 'Invalid email.'
            });
        }
    }
};

//------------------------ Private Methods-------------------------------------
function genToken(user) {
    var expires = expiresIn(7); // 7 days
    var token = jwt.encode({
        exp: expires,
        user: user
    }, require('../middlewares/secret.js')());
    return {
        token: token,
        expires: expires
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

//Searches db for matching login information
//return true if match, else false otherwise
function areCredentialsValid(inUsername, inPassword, callback) {
    MongoClient.connect(constants.dbConnection, function(err, db) {
        if (err) {
            console.log("Unable to connect to the db");
        } else {
            var collection = db.collection('plateUsers');
            var query = {
                username: {
                    $eq: inUsername
                },
                password: {
                    $eq: inPassword
                }
            };
            collection.find(query).toArray(function(err, users) {
                if (!err) {
                    if (users.length !== 0) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                } else {
                    console.log('Error trying to validate credentials!');
                    callback(false);
                }
                db.close();
            });
        }
    });
}

module.exports = auth;
