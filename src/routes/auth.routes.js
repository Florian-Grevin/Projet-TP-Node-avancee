const express = require('express');
const passport = require('passport');
const router = express.Router();
const {userController, authController} = require('../container');

router.post('/register', authController.register.bind(authController));

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({ message: "Login OK", user: req.user });
});


router.get('/profile', authController.getProfile.bind(authController));

router.post('/logout', authController.logout.bind(authController));

module.exports = router;