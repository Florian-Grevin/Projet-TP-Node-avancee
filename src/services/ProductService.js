const BaseService = require('../core/BaseService');
const { pipeline } = require('stream/promises');
const csv = require('csv-parser');
const { stringify } = require('csv-stringify')
// Import des streams customs
const ProductValidationTransform = require('../streams/ProductValidationTransform');
const ProductBatchInsertWritable = require('../streams/ProductBatchInsertWritable');
const { Readable } = require('stream');
class ProductService extends BaseService {
    constructor(repository) {
        super(repository);
    }
    // Méthode CRUD héritées (findAll, etc.) sont déjà là !
    /**
    * Importe des produits depuis un flux de lecture (ex: req ou file stream)
    * @param {Readable} inputStream
    */
    async importProducts(inputStream) {
        const validationTransform = new ProductValidationTransform();
        // ATTENTION : Il faut lui passer le repository pour qu'il puisse sauvegarder !
        const batchInsertWritable = new ProductBatchInsertWritable({
            repository: this.repository.repo,
            batchSize: 500
        });

        await pipeline(
        inputStream,
        csv(), // Convertit le binaire en objets JS bruts
        validationTransform,
        batchInsertWritable
        );
        console.log("✅ Pipeline d'import terminé avec succès !");
    }
    /**
    * Exporte les produits vers un flux d'écriture (ex: res)
    * @param {Writable} outputStream
    */
    async exportProducts(outputStream) {
        const repo = this.repository.repo;
        // Générateur async pour lire la BDD ligne par ligne (Memory safe)
        async function* productGenerator() {
            let lastId = 0;
            const batchSize = 1000;
            while (true) {
                // Log pour vérifier que la pagination se fait bien
                console.log(`📦 Fetching batch starting after ID ${lastId}...`);

                const products = await repo.createQueryBuilder("product")
                .select(["product.id", "product.name", "product.price", "product.stock",
                "product.description", "product.isArchived"])
                .where("product.id > :lastId", { lastId })
                .orderBy("product.id", "ASC")
                .take(batchSize)
                .getMany();
                // Si aucun produit n'est retourné, on a fini : on sort de la boucle
                if (products.length === 0) break;
                // On "émet" (yield) chaque produit un par un vers le stream
                for (const product of products) {
                    yield product;
                }
                // On met à jour le curseur pour le prochain tour
                lastId = products[products.length - 1].id;
            }
        }
        const queryStream = Readable.from(productGenerator());
        const csvTransformer = stringify({
            header: true,
            columns: ["id", "name", "price", "stock", "description", "isArchived"]
        });
        // 3. Exécution du pipeline (connecte Source -> CSV -> Sortie)
        // Le 'await' permet d'attendre que tout le transfert soit terminé avant de finir la fonction
        await pipeline(
        queryStream,
        csvTransformer,
        outputStream // Ceci est l'objet 'res' passé par le contrôleur
        );
    }
}
module.exports = ProductService;
