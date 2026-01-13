const BaseController = require('../core/BaseController');

class UserController extends BaseController {
    constructor(userService) {
        super(userService);
    }
}

module.exports = UserController;
