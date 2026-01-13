module.exports = {
    testEnvironment: 'node', // On teste du Node.js (pas du navigateur)
    verbose: true, // Affiche les détails de chaque test
    setupFilesAfterEnv: ['./tests/setup.js'], // Script exécuté AVANT chaque fichier de test
    collectCoverageFrom: ['src/**/*.js'] // Fichiers à surveiller pour le coverage
};
