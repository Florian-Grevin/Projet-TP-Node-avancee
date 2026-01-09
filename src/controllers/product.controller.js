// src/controllers/product.controller.js
const productService = require('../services/product.service');
class ProductController {
    async importProducts(req, res) {
        try {
            // 1. Vérification basique du Content-Type (Sécurité)
            // On veut du binaire brut ou du csv
            const contentType = req.headers['content-type'];
        if (!contentType || (!contentType.includes('text/csv') && !contentType.includes('application/octet-stream'))) {
        // Note: Pour ce TP on accepte large, mais en prod soyez stricts
        console.warn("⚠️ Attention: Content-Type inhabituel", contentType);
        }
        // 2. Délégation au service
        // On passe 'req' directement car c'est un Readable Stream !
        await productService.importProducts(req);
        // 3. Réponse succès
        res.status(201).json({ message: 'Import terminé avec succès' });
        } catch (error) {
        console.error('❌ Erreur Import:', error);
        res.status(500).json({ message: 'Erreur durant l\'import', error: error.message });
        }
    }
    async exportProducts(req, res) {
        try {
            // 1. Headers pour forcer le téléchargement
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="products_export.csv"');
            // 2. Lancement du stream vers 'res'
            // 'res' est un Writable Stream, on peut écrire dedans !
            await productService.exportProducts(res);
            // Pas besoin de res.send(), le pipeline a déjà fini la réponse (res.end())
        } catch (error) {
            console.error('❌ Erreur Export:', error);
            // Si les headers sont déjà partis (le téléchargement a commencé), on ne peut plus envoyer de JSON
            if (!res.headersSent) {
                res.status(500).json({ message: 'Erreur export', error: error.message });
            } else {
                res.end(); // On coupe la connexion proprement
            }
        }
    }
}
module.exports = new ProductController();