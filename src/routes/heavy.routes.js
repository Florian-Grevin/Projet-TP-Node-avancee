const express = require('express');
const router = express.Router();
const HeavyComputationController = require('../controllers/HeavyComputationController');
// Route qui va bloquer le serveur
router.get('/heavy-task-blocking', HeavyComputationController.blockingTask);
module.exports = router;