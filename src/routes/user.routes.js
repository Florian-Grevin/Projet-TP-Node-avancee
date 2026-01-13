const express = require('express');
const router = express.Router();
const { userController } = require('../container');

router.get('/', userController.handleRequest('getAll'));
router.post('/', userController.handleRequest('create'));
router.get('/:id', userController.handleRequest('getById'));
router.delete('/:id', userController.handleRequest('delete'));

module.exports = router;
