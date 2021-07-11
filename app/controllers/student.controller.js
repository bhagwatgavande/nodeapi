const Student = require('../models/student.model.js');
const multer = require('multer');
fs = require('fs'),

    // Create and Save a new Student
    exports.create = (req, res) => {
        // Validate request
        if (!req.body.name) {
            return res.status(400).send({
                message: "student name can not be empty"
            });
        }
        if (!req.body.email) {
            return res.status(400).send({
                message: "student email can not be empty"
            });
        }
        if (!req.body.mobile) {
            return res.status(400).send({
                message: "student mobile can not be empty"
            });
        }
        if (!req.body.profilepic) {
            return res.status(400).send({
                message: "student profilepic can not be empty"
            });
        }
        if (!req.body.status) {
            return res.status(400).send({
                message: "student status can not be empty"
            });
        }

        // Create a Student
        const student = new Student({

            name: req.body.name || "Untitled name",
            email: req.body.email || "Untitled email",
            mobile: req.body.mobile || "Untitled mobile",
            profilepic: req.file.profilepic || "Untitled profilepic",
            status: req.body.status || "Untitled status",

        });

        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './uploads');
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname);
            }
        });
        const uploadImg = multer({ storage: storage }).single('profilepic');
        upload(req, res, function (err) {
            console.log(req.file)
        });
        // Save Student in the database
        student.save()
            .then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the student."
                });
            });
    };

// Retrieve and return all student from the database.
exports.findAll = (req, res) => {
    Student.find()
        .then(student => {
            res.send(student);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving student."
            });
        });
};

// Find a single Student with a studentId
exports.findOne = (req, res) => {
    Student.findById(req.params.studentId)
        .then(student => {
            if (!student) {
                return res.status(404).send({
                    message: "student not found with id " + req.params.studentId
                });
            }
            res.send(student);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "student not found with id " + req.params.student
                });
            }
            return res.status(500).send({
                message: "Error retrieving note with id " + req.params.student
            });
        });
};

// Update a student identified by the studentId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body.name) {
        return res.status(400).send({
            message: "student name can not be empty"
        });
    }
    if (!req.body.email) {
        return res.status(400).send({
            message: "student email can not be empty"
        });
    }
    if (!req.body.mobile) {
        return res.status(400).send({
            message: "student mobile can not be empty"
        });
    }
    if (!req.body.profilepic) {
        return res.status(400).send({
            message: "student profilepic can not be empty"
        });
    }
    if (!req.body.status) {
        return res.status(400).send({
            message: "student status can not be empty"
        });
    }
    // Find student and update it with the request body
    Student.findByIdAndUpdate(req.params.studentId, {
        name: req.body.name || "Untitled name",
        email: req.body.email || "Untiled email",
        mobile: req.body.mobile || "Untiled mobile",
        profilepic: req.body.profilepic || "Untiled profilepic",
        status: req.body.status || "Untiled status",
    }, { new: true })
        .then(student => {
            if (!student) {
                return res.status(404).send({
                    message: "student not found with id " + req.params.studentId
                });
            }
            res.send(student);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "student not found with id " + req.params.studentId
                });
            }
            return res.status(500).send({
                message: "Error updating student with id " + req.params.studentId
            });
        });
};

// Delete a note with the specified studentId in the request
exports.delete = (req, res) => {
    Note.findByIdAndRemove(req.params.studentId)
        .then(student => {
            if (!student) {
                return res.status(404).send({
                    message: "student not found with id " + req.params.studentId
                });
            }
            res.send({ message: "student deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "student not found with id " + req.params.studentId
                });
            }
            return res.status(500).send({
                message: "Could not delete student with id " + req.params.studentId
            });
        });
};