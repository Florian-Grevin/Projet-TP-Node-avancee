// On intercepte TOUS les appels à 'ioredis'
jest.mock('ioredis', () => {
    return jest.fn().mockImplementation(() => ({
        // Simulation des événements (.on('connect'), .on('error'))
        on: jest.fn(),
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue("OK"),
        // Fermeture propre
        quit: jest.fn(),
        disconnect: jest.fn(),
        status: 'ready'
    }));
});
