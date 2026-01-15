const BaseRepository = require('../core/BaseRepository');
const Product = require('../entities/Product');

class ProductRepository extends BaseRepository {
    constructor(dataSource) {
        super(Product, dataSource);
    }

    findAll() {
        return this.repo.find();
    }

    findById(id) {
        return this.repo.findOneBy({ id });
    }

    create(data) {
        return this.repo.save(data);
    }

    delete(id) {
        return this.repo.delete(id);
    }
}
module.exports = ProductRepository;
