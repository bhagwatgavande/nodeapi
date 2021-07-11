module.exports = function (app) {
    const userHandlers = require('../controllers/user.controller.js');

    // rotues Routes
    app.route('/tasks')
        .post(userHandlers.loginRequired, userHandlers.profile);

    // user register
    app.route('/auth/register')
        .post(userHandlers.register);

    //user sign_in
    app.route('/auth/sign_in')
        .post(userHandlers.sign_in);

    // Retrieve all getuser
    app.route('/getuser')
        .get(userHandlers.getuser);

    //user getbyid 
    app.route('/getuserbyid')
        .post(userHandlers.getuserbyid);

    //user update byid 
    app.route('/updateuserbyid')
        .post(userHandlers.userupdate);

};