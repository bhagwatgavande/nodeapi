module.exports = (app) => {
    const students = require('../controllers/student.controller.js');
    const multer = require('multer');
    const path = require('path');

    const upload = multer({
        dest: 'images',
        storage: 'images',
        limits: {
            fileSize: 1024 * 1024
        },
        fileFilter: function (req, file, callback, error) {
            var ext = path.extname(file.originalname);
            var error_msg = error instanceof multer.MulterError;
            if (ext !== '.jpeg') {
                req.fileValidationError = "Not a jpg file!";
                return callback(null, false, req.fileValidationError);
            }
            if (error_msg) {
                req.fileSizeError = "Image more than"
                return callback(null, false, req.fileSizeError)
            }
            callback(null, true)
        }
    });

    // Create a new Note
    app.post('/students', function (req, res) {
        students.create
        upload.single('profilepic')(req, res, function (error) {
            req.fileValidationError = "Not a jpg file!";
            if (req.fileValidationError) {
                res.status(500).send({ message: req.fileValidationError });
            }
            else {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    req.fileSizeError = "Image more than 1MB!";
                    res.status(500).send({ message: req.fileSizeError });
                }
                else {
                    console.log('File Received!');
                    console.log(req.file);
                    //  var sql = "INSERT INTO `file`(name,description,type,size) VALUES('" + req.file.filename + "', '" + (req.file.encoding + "_" + req.file.destination + "_" + req.file.path) + "', '" + req.file.mimetype + "', '" + req.file.size + "')";
                    //  db.query(sql, (error, results) => {
                    //  console.log('Inserted Data!');
                    //});
                    const message = "Successfully Uploaded!"
                    res.status(200).send({ message: message, file_details: req.file })
                }
            }
        })
    });

    // Retrieve all Notes
    app.get('/students', students.findAll);

    // Retrieve a single Note with noteId
    app.get('/students/:studentId', students.findOne);

    // Update a Note with noteId
    app.put('/students/:studentId', students.update);

    // Delete a Note with noteId
    app.delete('/students/:studentId', students.delete);
}