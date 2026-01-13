const express = require('express');

module.exports = (userController) => {
    const router = express.Router();

    router.get('/', userController.handleRequest('getAll'));
    router.get('/:id', userController.handleRequest('getById'));
    router.post('/', userController.handleRequest('create'));
    router.delete('/:id', userController.handleRequest('delete'));

    return router;
};
