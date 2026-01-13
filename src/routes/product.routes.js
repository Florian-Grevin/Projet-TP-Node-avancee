const express = require('express');

module.exports = (productController) => {
    const router = express.Router();

    // Export CSV
    router.get('/export', (req, res) => productController.exportProducts(req, res));

    // Import CSV
    router.post('/import', (req, res) => productController.importProducts(req, res));

    // CRUD
    router.get('/', productController.handleRequest('getAll'));
    router.get('/:id', productController.handleRequest('getById'));
    router.post('/', productController.handleRequest('create'));
    router.delete('/:id', productController.handleRequest('delete'));

    return router;
};
