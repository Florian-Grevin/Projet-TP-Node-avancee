const request = require('supertest');
// --- ZONE DE MOCKING (AVANT L'IMPORT DE L'APP) ---
// 1. MOCK DU CONTAINER (Pour isoler le contrôleur de la BDD)
jest.mock('../../src/container', () => {

    // On fabrique un faux ProductService
    const mockProductService = {
        findAll: jest.fn().mockResolvedValue([
            { id: 1, name: 'Fake Product', price: 99 }
        ]),
        importProducts: jest.fn(),
        exportProducts: jest.fn()
    };
    // On instancie le VRAI contrôleur avec le FAUX service
    const ProductController = require('../../src/controllers/ProductController');
    const productController = new ProductController(mockProductService);
    // Helper pour les autres contrôleurs qu'on ne teste pas ici
    const dummyController = { handleRequest: () => (req, res, next) => next() };

    // Mock UserController
    const mockUserController = {
        handleRequest: () => (req, res, next) => next()
    };

    // Mock AuthController
    const mockAuthController = {
        register: () => (req, res, next) => next(),
        login: () => (req, res, next) => next(),
        logout: () => (req, res, next) => next(),
        getProfile: () => (req, res, next) => next(),
        handleRequest: () => (req, res, next) => next()
    };

    // Mock SearchController
    const mockSearchController = {
        indexAll: (req, res, next) => next(),
        search: jest.fn((req, res, next) => next()),
        handleRequest: () => (req, res, next) => next()
    };

    // On retourne l'objet qui remplace le fichier container.js
    return {
        userController: mockUserController,
        authController: mockAuthController,
        productController,
        searchController: mockSearchController,

        // Optionnel mais utile si d’autres fichiers l’appellent
        createControllers: () => ({
            userController: mockUserController,
            authController: mockAuthController,
            productController,
            searchController: mockSearchController
        })
    };
});
// 2. MOCK DE PASSPORT (Pour contourner le login)
jest.mock('../../src/config/passport', () => ({
    // On surcharge le middleware initialize pour injecter un user factice
    initialize: () => (req, res, next) => {
        req.isAuthenticated = () => true;
        req.user = { id: 1, username: 'TestAdmin' };
        next();
    },
    session: () => (req, res, next) => next(),
    authenticate: () => (req, res, next) => next()
}));

// 3. MOCK DE PISCINA
jest.mock('piscina', () => {
    return jest.fn().mockImplementation(() => ({
        run: jest.fn()
    }));
});

// IMPORTANT : On importe l'app APRÈS les mocks
const app = require('../../src/app');
// --- ZONE DE TEST ---
describe('Product API Integration', () => {
    describe('GET /products', () => {
        it('devrait retourner la liste des produits mockés (200 OK)', async () => {
        // ACT
        const response = await request(app).get('/products');
        // ASSERT
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0].name).toBe('Fake Product');
        });
    });
});