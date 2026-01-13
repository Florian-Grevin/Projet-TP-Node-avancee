const BaseService = require('../core/BaseService');

class UserService extends BaseService {
    constructor(userRepository) {
        super(userRepository);
    }
}

module.exports = UserService;
