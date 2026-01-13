const BaseRepository = require('../core/BaseRepository');
const Product = require('../entities/Product');

class ProductRepository extends BaseRepository {
    constructor(dataSource) {
        super(Product, dataSource);
    }
}

module.exports = ProductRepository;
