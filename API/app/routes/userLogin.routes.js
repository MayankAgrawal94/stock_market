module.exports = (app) => {
    const users = require('../controllers/userLogin.controller.js');

    // Create a new users
    // app.post('/usersSignUp', users.create);

    // Retrieve all users
    app.post('/usersLogin', users.login);

    // check login session
    app.get('/checkSession', users.session);

}