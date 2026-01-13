class BaseService {
/**
* @param {BaseRepository} repository - Instance du repository associé
*/
constructor(repository) {
    this.repository = repository;
}
async findAll() {
    return await this.repo.findAll();
}
async findById(id) {
    return await this.repo.findById(id);
}
async create(data) {
    return await this.repo.create(data);
}
async update(id, data) {
    return await this.repo.update(id,data);
}
async delete(id) {
    return await this.repo.delete(id);
}
}
module.exports = BaseService;