// TODO Finir le test de auth.service.test.js
/*
// Dans le describe('register') ...
it('devrait lancer une erreur si username ou password est manquant', async () => {
    // TODO: Appeler register('', 'pass') et vérifier que ça throw "Username et password requis"
    register('', 'pass');
});

it('devrait lancer une erreur si les champs sont vides', async () => {
    // ACT & ASSERT
    await expect(authService.register('', 'password'))
    .rejects
    .toThrow('Username et password requis');
    await expect(authService.register('user', ''))
    .rejects
    .toThrow('Username et password requis');
});
it('devrait lancer une erreur si le username est pris', async () => {
    // ARRANGE
    mockUserRepository.findByUsername.mockResolvedValue({ id: 1 }); // Il existe déjà
    // ACT & ASSERT
    await expect(authService.register('deja_pris', 'password'))
    .rejects
    .toThrow('Username déjà pris');
});*/