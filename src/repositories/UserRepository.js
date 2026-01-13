const BaseRepository = require('../core/BaseRepository');
const User = require('../entities/User');

class UserRepository extends BaseRepository {

    constructor(dataSource) {
        // TODO: Appeler le constructeur parent (super) avec le nom de l'entité 'User'
        super(User, dataSource);
        // On peut aussi le stocker sous un nom plus explicite si besoin
        this.userRepo = this.repo
    }
    // Pour l'instant, aucune méthode spécifique n'est nécessaire.
    // On hérite de findAll, create, etc.
    async findByUsername(username) { return this.repo.findOne({ where: { username } }); }
}
module.exports = UserRepository;
