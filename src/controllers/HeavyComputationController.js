// Structure attendue
class HeavyComputationController {
    static async blockingTask(req, res) {
        console.log(`[${process.pid}] Début de la tâche bloquante...`);
        // TODO: Initialiser le temps de départ
        const startTime = Date.now();
        let cnt=0;
        // TODO: Créer une boucle for de 0 à 5 000 000 000
        for(let i=0; i < 5000000000; i++) {
            cnt++;
        }
        const endTime = Date.now();

        // (Cette opération ne fait rien d'autre qu'incrémenter un compteur)
        // TODO: Calculer la durée totale
        const totalTime = endTime - startTime;
        console.log(`[${process.pid}] Tâche terminée.`);
        res.status(200).json({ message: 'Temps total : ', totalTime });
        // TODO: Renvoyer la réponse JSON
    }
}
module.exports = HeavyComputationController;