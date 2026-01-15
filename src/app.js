// app.js
require('dotenv').config();
require('reflect-metadata');

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redis = require('./config/redis');
const passport = require('./config/passport');

const { userController, authController, productController, searchController } = require('./container');

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Sessions
const sessionMiddleware = session({
    store: new RedisStore({ client: redis }),
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 86400 * 1000
    }
});
app.use(sessionMiddleware);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Static
app.use(express.static('public'));

// Controllers
//const { userController, authController, productController, searchController } = createControllers();


// Routes
app.use('/users', require('./routes/user.routes')(userController));
app.use('/', require('./routes/auth.routes')(authController));
app.use('/products', require('./routes/product.routes')(productController));
app.use('/', require('./routes/search.routes')(searchController));
app.use('/', require('./routes/stats.routes'));
app.use('/', require('./routes/heavy.routes'));

if (process.env.NODE_ENV === 'test') {
module.exports = app; // Supertest a besoin de l’instance Express
} else {
    module.exports = { app, sessionMiddleware }; // server.js a besoin des deux
}