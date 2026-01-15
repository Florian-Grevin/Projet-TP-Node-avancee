const { DataSource } = require('typeorm');
const User = require('../entities/User');
const Product = require('../entities/Product');
const Post = require('../entities/Post');

const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite', // Fichier local
    synchronize: true, // DEV ONLY
    logging: false,
    entities: [User, Product, Post],
});

module.exports = AppDataSource;