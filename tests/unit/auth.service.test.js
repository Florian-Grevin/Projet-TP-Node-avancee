const bcrypt = require('bcryptjs');
const AuthService = require('../../src/services/AuthService');

// On crée un faux repository avec jest.fn() 
const mockUserRepository = { findByUsername: jest.fn() };

// On mock bcrypt pour éviter les vrais hash
jest.mock('bcryptjs');

// Instance du service avec le faux repo
const authService = new AuthService(mockUserRepository);

describe('validateUser', () => {
    // --- TEST 1 : Utilisateur Inconnu ---
    it('devrait retourner null si l\'utilisateur n\'existe pas', async () => {
        // ARRANGE
        // TODO: Configurer le mock pour qu'il retourne null
        mockUserRepository.findByUsername.mockResolvedValue(null);
        // ACT
        // TODO: Appeler la méthode avec n'importe quel nom
        const result = await authService.validateUser('unknown_user', 'password');
        // ASSERT
        // TODO: Vérifier que le résultat est null
        expect(result).toBeNull();
        // TODO: Vérifier que le repo a été appelé avec le bon argument
        expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('unknown_user');
    });
    // --- TEST 2 : Mauvais Mot de Passe ---
    it('devrait retourner null si le mot de passe est incorrect', async () => {
        // ARRANGE
        const fakeUser = { id: 1, username: 'alice', password: 'hashed_password' };
        // TODO: Configurer le repo pour retourner fakeUser
        mockUserRepository.findByUsername.mockResolvedValue(fakeUser);
        // TODO: Configurer bcrypt pour qu'il dise "Non" (false)
        bcrypt.compare.mockResolvedValue(false);
        // ACT
        const result = await authService.validateUser('alice', 'wrong_password');
        // ASSERT
        expect(result).toBeNull();
        // TODO: Vérifier que bcrypt a comparé 'wrong_password' avec le mdp du user
        expect(bcrypt.compare).toHaveBeenCalledWith('wrong_password', 'hashed_password');
    });
    // --- TEST 3 : Succès ---
    it('devrait retourner l\'utilisateur si le mot de passe est correct', async () => {
        // ARRANGE
        const fakeUser = { id: 1, username: 'alice', password: 'hashed_password' };
        // TODO: Configurer le repo (trouvé) et bcrypt (valide)
        mockUserRepository.findByUsername.mockResolvedValue(fakeUser);
        bcrypt.compare.mockResolvedValue(true); // true
        // ACT
        const result = await authService.validateUser('alice', 'good_password');
        // ASSERT
        // TODO: Vérifier que le résultat est égal à fakeUser
        const { password, ...expectedUser } = fakeUser;
        expect(result).toEqual(expectedUser);
    });
});