const { Worker } = require('worker_threads');
const Piscina = require('piscina');
const path = require('path');

// Pool avec 100 workers
const pool = new Piscina({
    filename: path.resolve(__dirname, '../workers/piscinaWorker.js'),
    maxThreads: 4
});



class HeavyComputationController {
    static async blockingTask(req, res) {
        console.log(`[${process.pid}] Début de la tâche bloquante...`);
        const startTime = Date.now();
        let cnt=0;
        for(let i=0; i < 5000000000; i++) {
            cnt++;
        }
        const endTime = Date.now();

        const totalTime = endTime - startTime;
        console.log(`[${process.pid}] Tâche terminée.`);
        res.status(200).json({ message: 'Temps total : ', totalTime });
    }

    static async workerTask(req, res) {
        console.log(`[${process.pid}] Délégation au worker...`);
        const start = Date.now();
        // Chemin absolu obligatoire pour les Workers
        const workerPath = path.resolve(__dirname, '../workers/worker.js');
        // Création du thread
        const worker = new Worker(workerPath, {
            workerData: { iterations: 5000000000 }
        });
        // Écoute du succès
        worker.on('message', (result) => {
            const duration = Date.now() - start;
            console.log(`[${process.pid}] Worker a fini en ${duration}ms`);
            res.json({
            status: 'success',
            mode: 'non-blocking (worker)',
            pid: process.pid, // Notez que c'est toujours le même PID parent qui répond
            duration: `${duration}ms`,
            result: result
            });
        });
        // Écoute des erreurs
        worker.on('error', (err) => {
            console.error(err);
            res.status(500).json({ error: err.message });
        });
    }

    static async piscinaTask(req, res) {
        try {
            const start = Date.now();

            const result = await pool.run({ iterations: 5000000000 });

            const duration = Date.now() - start;

            res.json({
                status: 'success',
                mode: 'Piscina worker pool',
                pid: process.pid,
                duration: `${duration}ms`,
                result
            });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}
module.exports = HeavyComputationController;