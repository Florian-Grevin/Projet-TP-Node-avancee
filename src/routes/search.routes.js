
module.exports = (searchController) => {
    const router = require('express').Router();
    // Route utilitaire pour forcer l'indexation
    router.post('/search/index-all', searchController.indexAll.bind(searchController));
    router.get('/search', searchController.search);
    return router;
};
