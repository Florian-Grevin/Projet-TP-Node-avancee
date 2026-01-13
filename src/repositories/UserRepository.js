const BaseRepository = require('../core/BaseRepository');
const User = require('../entities/User');

class UserRepository extends BaseRepository {

    constructor(dataSource) {
        super(User, dataSource);
        this.userRepo = this.repo
    }
    // Pour l'instant, aucune méthode spécifique n'est nécessaire.
    // On hérite de findAll, create, etc.
    async findByUsername(username) { return this.repo.findOne({ where: { username } }); }
}
module.exports = UserRepository;
