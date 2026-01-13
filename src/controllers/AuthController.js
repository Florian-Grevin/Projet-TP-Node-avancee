const BaseController = require('../core/BaseController');
//const authService = require('../services/AuthService');
class AuthController extends BaseController {
    constructor(authService) {
        super(authService); // Le service principal est authService
        // On peut aussi le stocker sous un nom plus explicite si besoin
        this.authService = authService;
    }
    async register(req, res) {
        const { username, password } = req.body;
        try {
            const result = await this.authService.register(username, password)
            return res.status(201).json({ result });
        } catch (error) {
            // Gestion fine des erreurs métier
            if (error.message === 'Username déjà pris') {
                return res.status(409).json({ message: error.message });
            }
            if (error.message === 'Username et password requis') {
                return res.status(400).json({ message: error.message });
            }
            // Pour les autres erreurs, on laisse remonter (ou throw error)
            throw error;
        }
    }
    login(req, res) {
    // Passport fait le travail en amont via le middleware,
    // ici on renvoie juste le succès.
    res.json({ message: 'Connecté', user: req.user.username });
    }
    // ... garder logout et getProfile tels quels pour l'instant
    getProfile(req, res) {
        console.log(process.pid) 
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: 'Non autorisé' });
        }
        res.json(req.user);
    }

    logout(req, res, next) {
        req.logout((err) => {
            if (err) { return next(err); }
            res.json({ message: 'Déconnecté' });
        });
    }

}
module.exports = AuthController; // Note: Export de la CLASSE, pas d'une instance (new)