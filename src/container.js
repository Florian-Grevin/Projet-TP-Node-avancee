const AppDataSource = require('./config/db');

const UserRepository = require('./repositories/UserRepository');
const ProductRepository = require('./repositories/ProductRepository');

const UserService = require('./services/UserService');
const AuthService = require('./services/AuthService');
const ProductService = require('./services/ProductService');

const UserController = require('./controllers/UserController');
const AuthController = require('./controllers/AuthController');
const ProductController = require('./controllers/ProductController');

function createControllers() {
    const userRepository = new UserRepository(AppDataSource);
    const productRepository = new ProductRepository(AppDataSource);

    const userService = new UserService(userRepository);
    const authService = new AuthService(userRepository);
    const productService = new ProductService(productRepository);

    return {
        userController: new UserController(userService),
        authController: new AuthController(authService),
        productController: new ProductController(productService)
    };
}

module.exports = { createControllers };
