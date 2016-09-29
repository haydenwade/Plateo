var MongoClient = require('mongodb').MongoClient;
var autoIncrement = require("mongodb-autoincrement");
var constants = require('../constants.js');

var plates = {
    createPlate: function(req, res) {
      console.log('Creating Plate...');
        MongoClient.connect(constants.dbConnection, function(err, db) {
            autoIncrement.getNextSequence(db, 'plates', function(err, autoIndex) {
                var collection = db.collection('plates');
                if (!err) {
                    req.body._id = autoIndex;
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
                var projection = { };// _id : 1};
                collection.find(query, projection).toArray(function(error, myPlates) {
                    if (!error) {
                        //start of inner query
                        const plateIds = myPlates.map(function(item) {
                            return item.plateId
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
      console.log('Following plate...');
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
    }
};
module.exports = plates;
