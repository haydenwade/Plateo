/*jshint esversion: 6 */
var MongoClient = require('mongodb').MongoClient;
var autoIncrement = require("mongodb-autoincrement");
var constants = require('../constants.js');

var plates = {
    createPlate: function(req, res) {
      console.log('See if we can create plate...');
        MongoClient.connect(constants.dbConnection, function(err, db) {
            autoIncrement.getNextSequence(db, 'plates', function(err, autoIndex) {
                var collection = db.collection('plates');
                if (!err) {
                    req.body._id = autoIndex;
                    var query = {
                      number: {
                          $eq: req.body.number
                      },
                      state : {
                          $eq: req.body.state
                      }
                    };
                    collection.find(query).toArray(function(error, plates) {
                        if (!error) {
                          if(plates.length == 0){
                            console.log('Creating Plate...');
                            collection.insert(req.body, function(error, result) { //example of db error handling
                                if (error) {
                                    res.status(401);
                                    res.json({
                                        status: 401,
                                        message: 'We messed up trying to create your plate, sorry try again.',
                                        errors: error
                                    });
                                } else {
                                    console.log('Plate created.');
                                    res.json({});
                                }
                                db.close();
                            });
                          }else{
                            console.log('Plate already exists');
                            res.json({message:'Plate not created, already existed.'});
                          }
                        } else {
                            res.status(401);
                            res.json({
                                status: 401,
                                message: 'We messed up trying to create your plate, sorry try again.',
                                errors: error
                            });
                        }
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
        });
    },
    getPlate: function(req, res) {
      console.log('Getting plate...');
        MongoClient.connect(constants.dbConnection, function(err, db) {
            if (!err) {
              var collection = db.collection('plates');
              var query = {
                _id: {
                    $eq: parseInt(req.params.id)
                }
              }
                collection.find(query).toArray(function(error, plate) {
                    if (!error) {
                      console.log('Got the plate.');
                        res.json(plate);
                    } else {
                        res.status(401);
                        res.json({
                            status: 401,
                            message: 'We messed up trying to get the plate.',
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
    getAllPlates: function(req, res) {
      console.log('Getting all the plates...');
        MongoClient.connect(constants.dbConnection, function(err, db) {
            var collection = db.collection('plates');
            if (!err) {
                collection.find().toArray(function(error, plates) {
                    if (!error) {
                      console.log('Got all the plates.');
                        res.json(plates);
                    } else {
                        res.status(401);
                        res.json({
                            status: 401,
                            message: 'We messed up trying to get all the plates.',
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
    getPlatesForUser: function(req, res) {
        var userId = req.params.id;
        console.log('Getting plates for: ', userId);
        MongoClient.connect(constants.dbConnection, function(err, db) {
            var collection = db.collection('plateMapper');
            if (!err) {
                var query = {
                    userId: {
                        $eq: parseInt(userId)
                    }
                };
                var projection = { };
                collection.find(query, projection).toArray(function(error, myPlates) {
                    if (!error) {
                        //start of inner query
                        const plateIds = myPlates.map(function(item) {
                            return item.plateId;
                        });

                        var collection2 = db.collection('plates');
                        if (!err) {
                            var query2 = {
                                _id: {
                                    $in: plateIds
                                }
                            };
                            collection2.find(query2).toArray(function(error, plates) {
                                if (!error) {
                                  console.log('Got the users plates.');
                                    res.json(plates);
                                } else {
                                    res.status(401);
                                    res.json({
                                        status: 401,
                                        message: 'We messed up trying to get all the plates for that user.',
                                        errors: error
                                    });
                                }
                            });
                        } else {
                            res.status(401);
                            res.json({
                                status: 401,
                                message: 'Database connection issues, sorry try again.',
                                errors: err
                            });
                        }
                        //end of inner query
                    } else {
                        res.status(401);
                        res.json({
                            status: 401,
                            message: 'We messed up trying to get all the plates for that user.',
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
    followPlate: function(req, res) {
      console.log('Toggle following plate... ');
      const request = {
        userId: req.body.userId,
        plateId: req.body.plateId
      };
      plates.isUserFollowingPrivate(request, function(resp){
          if(!resp.errors){
            if(!resp.isFollowing){
              MongoClient.connect(constants.dbConnection, function(err, db) {
                  autoIncrement.getNextSequence(db, 'plateMapper', function(err, autoIndex) {
                      var collection = db.collection('plateMapper');
                      if (!err) {
                          req.body._id = autoIndex;
                          collection.insert(req.body, function(error, result) { //example of db error handling
                              if (error) {
                                  res.status(401);
                                  res.json({
                                      status: 401,
                                      message: 'We messed up trying to make you follow a  plate, sorry try again.',
                                      errors: error
                                  });
                              } else {
                                  console.log('Finished following plate.');
                                  res.json({});
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
              });
          } else{
            MongoClient.connect(constants.dbConnection, function(err, db) {
              if(!err){
                var collection = db.collection('plateMapper');
                var query = {
                  userId: {
                      $eq: parseInt(request.userId)
                  },
                  plateId: {
                      $eq: parseInt(request.plateId)
                  }
                };
                collection.remove(query, function(error, result){
                  if (error) {
                      res.status(401);
                      res.json({
                          status: 401,
                          message: 'We messed up trying to make you unfollow a plate, sorry try again.',
                          errors: error
                      });
                  } else {
                    console.log('Finished unfollowing plate.');
                      res.json({});
                  }
                  db.close();
                });
              }else {
                res.status(401);
                res.json({
                    status: 401,
                    message: 'Database connection issues, sorry try again.',
                    errors: err
                });
              }
            });
          }
        } else {
          res.status(401);
          res.json({
              status: 401,
              message: 'Something went wrong trying to check if user is following plate.',
              errors: resp.errors
          });
        }
      });
    },
    isUserFollowing: function(req, res) {
      var request = {
        userId : req.params.userId,
        plateId : req.params.plateId
      };
      plates.isUserFollowingPrivate(request, function(resp) {
          if(!resp.errors){
              console.log('Finished getting status if user follows plate.');
              res.json({isFollowing : resp.isFollowing});
          }
          else{
            res.json({
                status: 401,
                message: 'Something went wrong trying to check if user is following plate.',
                errors: resp.errors
            });
          }
      });
    },
    isUserFollowingPrivate: function(request, callback) {
      console.log('Checking if user is following plate: ', request);
      MongoClient.connect(constants.dbConnection, function(err, db) {
          if (!err) {
            var collection = db.collection('plateMapper');
            var query = {
                userId: {
                    $eq: parseInt(request.userId)
                },
                plateId: {
                    $eq: parseInt(request.plateId)
                }
            };
            collection.find(query).toArray(function(error, followingStatus) {
                if (!error) {
                    callback({isFollowing : followingStatus.length > 0});
                } else {
                    callback({errors: error});
                }
                db.close();
            });
          } else {
            callback({errors: err});
          }
      });
    }
};

module.exports = plates;
