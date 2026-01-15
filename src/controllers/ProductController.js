const BaseController = require('../core/BaseController');
class ProductController extends BaseController {
    constructor(service) {
        super(service);
    }
    async importProducts(req, res) {
        try {
            const contentType = req.headers['content-type'];
            if (!contentType || (!contentType.includes('text/csv') && !contentType.includes('application/octet-stream'))) {
                console.warn("⚠️ Attention: Content-Type inhabituel", contentType);
            }
            await this.service.importProducts(req);
            res.status(201).json({ message: 'Import terminé avec succès' });
        } catch (error) {
            console.error('❌ Erreur Import:', error);
            res.status(500).json({ message: 'Erreur durant l\'import', error: error.message });
        }
    }
    async exportProducts(req, res) {
        try {
            // Configuration de la réponse pour le téléchargement
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="products_export.csv"');

            await this.service.exportProducts(res)
        } catch (error) {
            console.error('❌ Erreur Export:', error);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Erreur export', error: error.message });
            } else {
                res.end();
            }
        }
    }

    async getAll(req, res) { 
        const results = await this.service.findAll(); res.status(200).json({ data: results }); 
    }
}
module.exports = ProductController;