
class BaseRepository {
/**
* @param {string|EntitySchema} entity - L'entité cible (ex: 'User')
* @param {DataSource} dataSource - La connexion TypeORM
*/
constructor(entity, dataSource) {
// TODO: Stocker l'entité et la dataSource dans l'instance
    this.entity = entity;
    this.dataSource = dataSource;
}
// Accesseur pour obtenir le repository TypeORM spécifique à l'entité
get repo() {
// TODO: Retourner le repository via this.dataSource.getRepository(...)
    return this.dataSource.getRepository(this.entity)
}
async findAll(options = {}) {
// TODO: Retourner tous les éléments via this.repo
    return await this.repo.find(options);
}
async findById(id) {
// TODO: Trouver un élément par son ID via this.repo
    return await this.repo.findOneBy( {id} );
}
async create(data) {
    // TODO: Créer une instance de l'entité avec les data
    const newData = this.repo.create(data);
    // TODO: Sauvegarder et retourner l'entité créée
    return await this.repo.save(newData);
}
async update(id, data) {
// TODO: Mettre à jour l'élément avec l'ID donné
    await this.repo.update(id, data);
// Note: TypeORM update ne retourne pas l'objet modifié par défaut.
// Pensez à retourner l'objet mis à jour (findById) après l'update.
    return await this.findById(id);
}
async delete(id) {
// TODO: Supprimer l'élément par son ID
    return await this.repo.delete(id);
}
}
module.exports = BaseRepository;