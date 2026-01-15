const AppDataSource = require('../config/db');
const Post = require('../entities/Post');
class SearchController {
    constructor(searchService) {
        this.searchService = searchService;
    }
    /**
    * Route POST /search/index-all
    * Récupère TOUT depuis SQL et l'envoie dans Elastic.
    */
    indexAll = async (req, res) => {
        try {
            // 1. Récupérer tous les posts depuis SQL
            const postRepo = AppDataSource.getRepository(Post);
            const posts = await postRepo.find();
            console.log(`[SYNC] Récupération de ${posts.length} posts SQL...`);
            // 2. Envoyer au service Elastic (Bulk)
            await this.searchService.bulkIndex(posts);
            res.json({
            success: true,
            message: `${posts.length} posts synchronisés vers Elasticsearch.`
        });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur de synchronisation' });
        }
    }

    /**
    * Route GET /search?q=...
    */
    search = async (req, res) => {
        try {
            const { q } = req.query;
            // Validation basique
            if (!q || q.length < 2) {
            return res.status(400).json({ error: 'Le paramètre de recherche "q" est trop court.' });
            }
            console.log(`[SEARCH] Recherche pour : "${q}"`);
            // Appel du service
            const results = await this.searchService.searchPosts(q);
            // Réponse
            res.json({
                query: q,
                count: results.length,
                results: results
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur serveur lors de la recherche' });
        }
    }
}
module.exports = SearchController;