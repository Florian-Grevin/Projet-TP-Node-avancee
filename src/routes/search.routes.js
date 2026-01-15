
module.exports = (searchController) => {
    const router = require('express').Router();
    // Route utilitaire pour forcer l'indexation
    router.post('/index-all', searchController.indexAll.bind(searchController));
    return router;
};
