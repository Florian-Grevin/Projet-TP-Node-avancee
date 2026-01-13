
class BaseRepository {
/**
* @param {string|EntitySchema} entity - L'entité cible (ex: 'User')
* @param {DataSource} dataSource - La connexion TypeORM
*/
constructor(entity, dataSource) {
    this.entity = entity;
    this.dataSource = dataSource;
}
// Accesseur pour obtenir le repository TypeORM spécifique à l'entité
get repo() {
    return this.dataSource.getRepository(this.entity)
}
async findAll(options = {}) {
    return await this.repo.find(options);
}
async findById(id) {
    return await this.repo.findOneBy( {id} );
}
async create(data) {
    const newData = this.repo.create(data);
    return await this.repo.save(newData);
}
async update(id, data) {
    await this.repo.update(id, data);
    return await this.findById(id);
}
async delete(id) {
    return await this.repo.delete(id);
}
}
module.exports = BaseRepository;