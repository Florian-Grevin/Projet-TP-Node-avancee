const express = require('express');
const passport = require('passport');

module.exports = (authController) => {
    const router = express.Router();

    router.post('/register', authController.register.bind(authController));

    router.post(
        '/login',
        passport.authenticate('local'),
        authController.login.bind(authController)
    );

    router.post('/logout', authController.logout.bind(authController));
    router.get('/profile', authController.getProfile.bind(authController));
    router.post('/logout', authController.logout.bind(authController));

    return router;
};
