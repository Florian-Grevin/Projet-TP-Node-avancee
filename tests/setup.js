// On intercepte TOUS les appels à 'ioredis'
jest.mock('ioredis', () => {
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
});