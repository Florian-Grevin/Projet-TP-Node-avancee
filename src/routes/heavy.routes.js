const express = require('express');
const router = express.Router();
const HeavyComputationController = require('../controllers/HeavyComputationController');

// Route qui va bloquer le serveur
router.get('/heavy-task-blocking', HeavyComputationController.blockingTask);
router.get('/heavy-task-worker', HeavyComputationController.workerTask);
router.get('/heavy-task-piscina', HeavyComputationController.piscinaTask);
module.exports = router;