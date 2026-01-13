class BaseController {
    /**
    * @param {BaseService} service - Instance du service associé
    */
    constructor(service) {
        this.service = service;
    }
    /**
    * Méthode utilitaire pour lier le contexte et gérer les erreurs.
    * C'est une High Order Function qui retourne un middleware Express.
    * @param {string} method - Nom de la méthode du contrôleur à exécuter
    */
    handleRequest(method) {
        return async (req, res, next) => {
            try {
                await this[method](req, res, next);
                // ATTENTION : Il faut passer req, res, next
            } catch (error) {
                next(error);
            }
        };
    }
    async getAll(req, res) {
        const results = await this.service.findAll();
        return res.status(200).json({
            success: true,
            message: "Opération réussie",
            data: results
        });

    }
    async getById(req, res) {
    const { id } = req.params;
        const result = await this.service.findById(id);
        if(!result) {
            return res.status(404).json({
                success: true,
                message: "Item not found",
                data: result
            });
        }
        return res.status(200).json({
            success: true,
            message: "Opération réussie",
            data: result
        });
    }
    async create(req, res) {
        const data  = req.body;
        const result = await this.service.create(data);
        return res.status(201).json({
            success: true,
            message: "Created",
            data: result
        });
    }
    async update(req, res) {
        const { id } = req.params;
        const data  = req.body;
        const result = await this.service.update(id, data);
        return res.status(200).json({
            success: true,
            message: "Updated",
            data: result
        });
    }
    async delete(req, res) {
    const { id } = req.params;
        await this.service.delete(id);
        return res.status(204).send();
    }
}
module.exports = BaseController;