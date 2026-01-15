const AppDataSource = require('./config/db');

const UserRepository = require('./repositories/UserRepository');
const ProductRepository = require('./repositories/ProductRepository');
const PostRepository = require('./repositories/PostRepository');

const UserService = require('./services/UserService');
const AuthService = require('./services/AuthService');
const ProductService = require('./services/ProductService');
const SearchService = require('./services/search.service');

const UserController = require('./controllers/UserController');
const AuthController = require('./controllers/AuthController');
const ProductController = require('./controllers/ProductController');
const SearchController = require('./controllers/search.controller');

const userRepository = new UserRepository(AppDataSource);
const productRepository = new ProductRepository(AppDataSource);
const postRepository = new PostRepository(AppDataSource);

const userService = new UserService(userRepository);
const authService = new AuthService(userRepository);
const productService = new ProductService(productRepository);
const searchService = new SearchService(postRepository);

module.exports = {
    userController: new UserController(userService),
    authController: new AuthController(authService),
    productController: new ProductController(productService),
    searchController: new SearchController(searchService),
};
