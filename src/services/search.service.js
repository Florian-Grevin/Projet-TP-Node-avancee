const client = require('../config/elastic');
class SearchService {
    constructor(postRepository) {
        this.postRepository = postRepository;
        this.index = 'posts'; // Le nom de notre "table" dans Elastic
    }
    /**
    * Initialise l'index avec le bon mapping si celui-ci n'existe pas.
    */
    async initIndex() {
        try {
            const exists = await client.indices.exists({
                index: this.index
            });

            if (exists) {
                console.log("Early return");
                return;
            }
            await client.indices.create({
                index: this.index,
                body: {
                mappings: {
                    properties: {
                        title: {
                            type: 'text', // 1. Pour la recherche (comme avant)
                            fields: {
                                // 2. SOUS-CHAMP pour le Tri
                                // On pourra l'appeler via "title.raw"
                                raw: { type: 'keyword' }
                            }
                        },
                        content: { type: 'text' },
                        tags: { type: 'keyword' },
                        created_at: { type: 'date' },
                        // --- AJOUT POUR L'AUTOCOMPLÉTION (TP 4) ---
                        suggest: { type: 'completion' }
                    }
                }
                }
            }); 
            console.log(`[ELASTIC] Index '${this.index}' créé avec succès.`);
        } catch (error) {
            console.error('[ELASTIC] Erreur lors de l\'initialisation de l\'index :', error.message);
        }
    }

    /**
    * Indexe un tableau de documents en une seule requête HTTP.
    * @param {Array} posts - Liste des entités Post venant de SQL
    */
    async bulkIndex(posts) {
        if (!posts || posts.length === 0) return;
        try {
            const operations = posts.flatMap(post => [
                { 
                    index: { _index: this.index, _id: post.id.toString() } 
                },
                {
                    title: post.title,
                    content: post.content,
                    tags: post.tags,
                    created_at: post.created_at,
                    // On nourrit le suggester avec les mots du titre
                    suggest: {
                        input: post.title.split(' ')
                    }
                }   
            ]);
            const bulkResponse = await client.bulk({
                refresh: true,
                operations
            });
            // Gestion d'erreurs simple
            if (bulkResponse.errors) {
            console.error('Erreurs lors du Bulk (voir logs pour détails)');
            // En prod, on parcourrait bulkResponse.items pour voir quel doc a échoué
            } else {
            console.log(` Bulk success : ${posts.length} documents indexés.`);
            }
        } catch (error) {
            console.error(' Erreur critique Bulk :', error.message);
        }
    }

    /**
    * Effectue une recherche Full Text sur les articles.
    * @param {string} query - Le terme recherché (ex: "node performance")
    * @returns {Array} - Liste des résultats formatés
    */
    async searchPosts({ q, page = 1, limit = 10, sort, filterTag }) {
        try {
            // 1. Calcul de la pagination
            const from = (page - 1) * limit;
            const size = parseInt(limit);
            // 2. Construction du squelette de la requête Bool
            const queryBody = {
            bool: {
                must: [], // Pour la recherche textuelle (Score)
                filter: [] // Pour les filtres exacts (Performance)
            }
            };
            // 3. Gestion de la recherche textuelle (q)
            if (q) {
            queryBody.bool.must.push({
                multi_match: {
                    query: q,
                    fields: ['title^3', 'content'], // Le titre pèse 3x plus lourd
                    type: 'phrase_prefix' // Permet de trouver "nod" pour "node"
                }
            });
            } else {
                // Si pas de recherche, on veut tout voir (Select *)
                queryBody.bool.must.push({ match_all: {} });
            }
            // 4. Gestion du Filtre par Tag (filterTag)
            if (filterTag) {
                queryBody.bool.filter.push({
                term: { tags: filterTag } // "term" cherche la valeur EXACTE dans un champ keyword
                });
            }
            // 5. Gestion du Tri (sort)
            const sortBody = [];
            if (sort === 'date') {
                sortBody.push({ created_at: 'desc' });
            } else if (sort === 'title') {
                // ATTENTION : On trie sur le champ RAW (keyword), pas sur le champ text !
                sortBody.push({ 'title.raw': 'asc' });
            }
            // 6. Exécution de la requête
            const result = await client.search({
                index: this.index,
                body: {
                    from,
                    size,
                    query: queryBody,
                    sort: sortBody,
                    // 7. Agrégations (Facettes)
                    // On demande à Elastic de compter les articles par tag.
                    aggs: {
                    tags_count: {
                        terms: { field: 'tags' }
                    }
                    }
                }
            });
            // 8. Formatage de la réponse
            return {
                hits: result.hits.hits.map(hit => ({
                id: hit._id,
                score: hit._score,
                ...hit._source
            })),
            total: result.hits.total.value,
            // On renvoie les facettes pour le front
            aggregations: result.aggregations ? result.aggregations.tags_count.buckets : []
            };
        } catch (error) {
            console.error('Error searching posts:', error.message);
            return { hits: [], total: 0, aggregations: [] };
        }
    }

}
module.exports = SearchService;
