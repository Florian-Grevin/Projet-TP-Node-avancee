const { parentPort, workerData } = require('worker_threads');

function heavyComputation(iterations) {
    console.log(`[${process.pid}] Worker Thread start`);
    const start = Date.now();

    let cnt = 0;
    for (let i = 0; i < iterations; i++) cnt++;

    return Date.now() - start;
}

const result = heavyComputation(workerData.iterations);
parentPort.postMessage(result);
