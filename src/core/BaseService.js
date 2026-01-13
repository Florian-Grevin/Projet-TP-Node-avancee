class BaseService {
/**
* @param {BaseRepository} repository - Instance du repository associé
*/
constructor(repository) {
// TODO: Injecter le repository (this.repository = ...)
    this.repository = repository;
}
async findAll() {
// TODO: Appeler la méthode findAll du repository
    return await this.repo.findAll();
}
async findById(id) {
// TODO: Appeler la méthode findById du repositor
    return await this.repo.findById(id);
}
async create(data) {
// TODO: Appeler la méthode create du repository
    return await this.repo.create(data);
}
async update(id, data) {
// TODO: Appeler la méthode update du repository
    return await this.repo.update(id,data);
}
async delete(id) {
// TODO: Appeler la méthode delete du repository
    return await this.repo.delete(id);
}
}
module.exports = BaseService;