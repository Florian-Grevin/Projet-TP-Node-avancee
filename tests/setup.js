// On intercepte TOUS les appels à 'ioredis'
/*jest.mock('ioredis', () => {
    // On retourne une fausse classe (car ioredis s'utilise avec 'new Redis()')
    return jest.fn().mockImplementation(() => ({
        // On liste les méthodes utilisées dans l'appli
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
        on: jest.fn(), // Pour les event listeners
        quit: jest.fn(),
        status: 'ready' // Propriété statique si besoin
    }));
});*/

// TODO: On intercepte le module 'ioredis'
jest.mock('ioredis', () => {
    return jest.fn().mockImplementation(() => ({
        // Simulation des événements (.on('connect'), .on('error'))
        on: jest.fn(),
        // TODO: Simuler .get(key) -> Doit retourner une Promesse résolue avec null
        get: jest.fn().mockResolvedValue(null),
        // TODO: Simuler .set(key, value) -> Doit retourner une Promesse "OK"
        set: jest.fn().mockResolvedValue("OK"),
        // Fermeture propre
        quit: jest.fn(),
        disconnect: jest.fn(),
        status: 'ready'
    }));
});
