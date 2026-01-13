const AppDataSource = require('./config/db');

const UserRepository = require('./repositories/UserRepository');
const UserService = require('./services/UserService');
const UserController = require('./controllers/UserController');

const AuthService = require('./services/AuthService');
const AuthController = require('./controllers/auth.controller'); // On va le refactoriser


const userRepository = new UserRepository(AppDataSource);

const userService = new UserService(userRepository);
const authService = new AuthService(userRepository);

const userController = new UserController(userService);
const authController = new AuthController(authService);

module.exports = {
    userController,
    authController
};