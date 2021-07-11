const Student = require('../models/user.model.js');
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = mongoose.model('User');

// register profile details users from the database.
exports.register = function (req, res) {
    const newUser = new User(req.body);
    newUser.hash_password = bcrypt.hashSync(req.body.hash_password, 10);
    newUser.save(function (err, user) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {
            user.hash_password = undefined;
            return res.json(user);
        }
    });
};

// check signin profile details users from the database.
exports.sign_in = function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) throw err;
        if (!user || !user.comparePassword(req.body.password)) {
            return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
        }
        return res.json({ token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id }, 'RESTFULAPIs') });
    });
};

// check login profile details users from the database.
exports.loginRequired = function (req, res, next) {
    if (req.user) {
        next();
    } else {

        return res.status(401).json({ message: 'Unauthorized user!!' });
    }
};

// Retrieve profile details users from the database.
exports.profile = function (req, res, next) {
    if (req.user) {
        res.send(req.user);
        next();
    }
    else {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Retrieve and return all users from the database.
exports.getuser = (req, res) => {
    User.find({}, '_id email fullName created')
        .then(user => {
            res.send(user);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        });
};

// Find a single user with a Id
exports.getuserbyid = (req, res) => {
    User.findById(req.body.id, '_id email fullName created')
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "user not found with id " + req.body.id
                });
            }
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "user not found with id " + req.body.user
                });
            }
            return res.status(500).send({
                message: "Error retrieving user with id " + req.body.user
            });
        });
};

// Update a user identified by the userId in the request
exports.userupdate = (req, res) => {
    // Validate Request
    if (!req.body.email) {
        return res.status(400).send({
            message: "user email can not be empty"
        });
    }
    if (!req.body.fullName) {
        return res.status(400).send({
            message: "user fullName can not be empty"
        });
    }
    if (!req.body.userId) {
        return res.status(400).send({
            message: "userId can not be empty"
        });
    }
    // Find user and update it with the request body
    User.findByIdAndUpdate(req.body.userId, {
        email: req.body.email || "Untitled email",
        fullName: req.body.fullName || "Untiled fullName",
    }, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "user not found with id " + req.body.userId
                });
            }
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "user not found with id " + req.body.userId
                });
            }
            return res.status(500).send({
                message: "Error updating user with id " + req.body.userId
            });
        });
};