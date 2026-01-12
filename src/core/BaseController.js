class BaseController {
    /**
    * @param {BaseService} service - Instance du service associé
    */
    constructor(service) {
    // TODO: Injecter le service
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
                // TODO: Exécuter la méthode passée en paramètre (this[method])
                await this[method](req, res, next);
                // ATTENTION : Il faut passer req, res, next
            } catch (error) {
                // TODO: Passer l'erreur au middleware d'erreur d'Express (next)
                next(error);
            }
        };
    }
    async getAll(req, res) {
        // TODO: Récupérer les items via le service
        const results = await this.service.findAll();
        // TODO: Renvoyer une réponse JSON (status 200 par défaut)
        return res.status(200).json({
            success: true,
            message: "Opération réussie",
            data: results
        });

    }
    async getById(req, res) {
    const { id } = req.params;
        // TODO: Récupérer l'item via le service
        const result = await this.service.findById(id);
        // TODO: Gérer le cas où l'item n'existe pas (404)
        if(!result) {
            return res.status(404).json({
                success: true,
                message: "Item not found",
                data: result
            });
        }
        // TODO: Renvoyer l'item en JSON
        return res.status(200).json({
            success: true,
            message: "Opération réussie",
            data: result
        });
    }
    async create(req, res) {
        const data  = req.body;
        // TODO: Créer l'item via le service avec req.body
        const result = await this.service.create(data);
        // TODO: Renvoyer une réponse 201 (Created)
        return res.status(201).json({
            success: true,
            message: "Created",
            data: result
        });
    }
    async update(req, res) {
        const { id } = req.params;
        const data  = req.body;
        // TODO: Mettre à jour via le service
        const result = await this.service.update(id, data);
        // TODO: Renvoyer l'item mis à jour
        return res.status(200).json({
            success: true,
            message: "Updated",
            data: result
        });
    }
    async delete(req, res) {
    const { id } = req.params;
        // TODO: Supprimer via le service
        await this.service.delete(id);
        // TODO: Renvoyer une réponse 204 (No Content) sans body
        return res.status(204).send();
    }
}
module.exports = BaseController;