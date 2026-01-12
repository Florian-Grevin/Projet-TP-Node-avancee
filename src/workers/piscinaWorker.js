function heavyComputation(iterations) {
    console.log(`[${process.pid}] Piscina start`);
    const start = Date.now();

    let cnt = 0;
    for (let i = 0; i < iterations; i++) cnt++;

    return Date.now() - start;
}

module.exports = ({ iterations }) => heavyComputation(iterations);
