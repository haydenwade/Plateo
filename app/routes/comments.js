var MongoClient = require('mongodb').MongoClient;
var autoIncrement = require("mongodb-autoincrement");
var ObjectID = require('mongodb').ObjectID;
var constants = require('../constants.js');

var comments = {
    addComment: function(req, res) {
      console.log("Creating comment...");
        MongoClient.connect(constants.dbConnection, function(err, db) {
          autoIncrement.getNextSequence(db, 'plateComments', function(err, autoIndex) {
            var collection = db.collection('plateComments');
            if (!err) {
                req.body._id = autoIndex;
                collection.insert(req.body, function(error, result) { //example of db error handling
                    if (error) {
                        res.status(401);
                        res.json({
                            status: 401,
                            message: 'We messed up trying to add your comment to  plate, sorry try again.',
                            errors: error
                        });
                    } else {
                        console.log('Comment created.');
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
    getComments: function(req, res){
      console.log('Getting comments...');
      var pId = req.params.id;
      MongoClient.connect(constants.dbConnection, function(err, db) {
          var collection = db.collection('plateComments');
          if (!err) {
              var query = {
                 plateId : {
                   $eq : parseInt(pId)
                 }
              };
              var projection = { };
              collection.find(query, projection).toArray(function(error, plates) {
                  if (!error) {
                      console.log('Got the comments');
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
    }
};
module.exports = comments;
