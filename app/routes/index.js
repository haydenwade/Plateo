var express = require('express');
var router = express.Router();

var auth = require('./auth.js');
var users = require('./users.js');
var plates = require('./plates.js');
var comments = require('./comments.js');

/*
 * Routes that can be accessed by any one
 */
router.post('/login', auth.login);
router.post('/register', auth.register);
router.get('/plates', plates.getAllPlates);
router.get('/comments/:id', comments.getComments);

/*
 * Routes that can be accessed only by authenticated & authorized users
 */
router.get('/api/v1/users', users.getAllUsers);//debugging - remove from PROD

router.get('/api/v1/plates/:id', plates.getPlatesForUser);
router.post('/api/v1/plates/', plates.createPlate);
router.post('/api/v1/plates/comment', comments.addComment);
router.post('/api/v1/plates/follow', plates.followPlate);



module.exports = router;
