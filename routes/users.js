var express = require('express');
var router = express.Router();
var users = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
	users.find(function(err, users) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(users);
    });

});

// create user
router.post('/', function(req, res) {
    users.create({
        name : req.body.name,
        email : req.body.email
    }, function(err, user) {
        if (err)
            res.send(err);

        res.json({id:user._id})
    });
});

// create user
router.delete('/:id', function(req, res) {
    users.remove({
        _id : req.params.id
    }, function(err, user) {
        if (err)
            res.send(err);

        res.send("User deleted")
    });
});
module.exports = router;