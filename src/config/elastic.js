const { Client } = require('@elastic/elasticsearch');

// Initialisation du client
// Utilise la variable d'environnement ou localhost par défaut
const client = new Client({
    node: process.env.ELASTIC_NODE || 'http://localhost:9200'
});
// Vérification de la connexion au démarrage
// La méthode .info() permet de tester la connectivité sans bloquer l'application
client.info()
.then(response => {
    console.log(`[ELASTIC] Connexion établie au cluster : ${response.name}`);
    console.log(`[ELASTIC] Version du serveur : ${response.version.number}`);
})
.catch(error => {
    console.error('[ELASTIC] Échec de la connexion au démarrage.');
    console.error('Détails :', error.message);
    console.error('Vérifiez que le conteneur Docker est bien démarré sur le port 9200.');
});
module.exports = client;
