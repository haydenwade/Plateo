var MongoClient = require('mongodb').MongoClient;
var autoIncrement = require("mongodb-autoincrement");
var constants = require('../constants.js');

var users = {
    getAllUsers: function(req, res) {
      console.log('Getting all users...');
        MongoClient.connect(constants.dbConnection, function(err, db) {
            if (!err) {
                var collection = db.collection('plateUsers');
                collection.find().toArray(function(error, users) {
                    if (!error) {
                      console.log('Got all users.');
                      res.json(users);
                    } else {
                        res.status(401);
                        res.json({
                            status: 401,
                            message: 'We messed up trying to get all the users.',
                            errors: error
                        });
                    }
                    db.close();
                });
            } else {
                res.status(401);
                res.json({
                    status: 401,
                    message: 'Database connection issues, sorry try again.',
                    errors: err
                });
            }
        });
    },
    getUser: function(username, callback) {
      console.log('Getting user: ', username);
      this.doesUsernameExist(username, function(resp) {
          if (resp.doesExist) {
              MongoClient.connect(constants.dbConnection, function(err, db) {
                  if (!err) {
                      var collection = db.collection('plateUsers');
                      var query = {
                        username :{
                          $eq : username
                        }
                      };
                      collection.find(query).toArray(function(error, users) {
                          if (!error) {
                            console.log('Got the user');
                              callback(users[0]);
                          } else {
                              //res.status(401);
                              callback({
                                  status: 401,
                                  message: 'We messed up trying to get the user.',
                                  errors: error
                              });
                          }
                          db.close();
                      });
                  } else {
                      callback({
                          status: 401,
                          message: 'Database connection issues, sorry try again.',
                          errors: err
                      });
                  }
              });
          } else {
              console.log(resp.message);
              callback({
                  status: 401,
                  message: 'Username was not found.'
              });
          }
      });
    },
    createUser: function(req, callback) {
      console.log('Creating user...');
        this.doesUsernameExist(req.username, function(resp) {
            //pass the errors up the chain
            // if (resp.errors !== undefined || resp.errors !== null) {
            //     console.log('errors in createUser: ', JSON.stringify(resp.errors));
            //     res.status(401);
            //     res.errors = resp.errors; //May get overriden from below
            // }
            if (!resp.doesExist) {
                var user = {
                    username: req.username,
                    fistname: req.firstname,
                    lastname: req.lastname,
                    email: req.email,
                    password: req.password,
                    role : 'default'
                };
                MongoClient.connect(constants.dbConnection, function(err, db) {
                  autoIncrement.getNextSequence(db, 'plates', function(err, autoIndex) {
                    if (!err) {
                        user._id = autoIndex;
                        var collection = db.collection('plateUsers');
                        collection.insert(user, function(error, result) {
                            if (error !== null) {
                                callback({
                                    status: 401,
                                    message: 'We messed up trying to create the user account.',
                                    errors: error
                                });
                            } else {
                              console.log('User was created');
                                callback({
                                    userId: result.ops[0]._id
                                });
                            }
                            db.close();
                        });
                    } else {
                        callback({
                            status: 401,
                            message: 'Database connection issues, sorry try again.',
                            errors: err
                        });
                    }
                });
              });
            } else {
                callback({
                    status: 401,
                    message: 'Username already taken, please choose another one.'
                });
            }
        });
    },
    doesUsernameExist: function(inUsername, callback) {
        MongoClient.connect(constants.dbConnection, function(err, db) {
            if (!err) {
                var collection = db.collection('plateUsers');
                var query = {
                    username: {
                        $eq: inUsername
                    }
                };
                var projection = {
                  password : 0
                };
                collection.find(query, projection).toArray(function(error, users) {
                    if (!error) {
                        if (users.length === 0) {
                            callback({
                                doesExist: false,
                                message: 'The given username is unique.'
                            });
                        } else {
                            callback({
                                doesExist: true,
                                message: 'A user already exists with that username.',
                                errors: error
                            });
                        }
                    } else {
                        callback({
                            isUnique: false,
                            message: 'We made a mistake in checking for unique username, sorry try again.',
                            errors: err
                        });
                    }
                    db.close();
                });
            } else {
                callback({
                    isUnique: false,
                    message: 'Database connection issues, sorry try again.',
                    errors: err
                });
            }
        });
    }
};

module.exports = users;
