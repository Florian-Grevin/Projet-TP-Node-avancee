// server.js
require('dotenv').config();
require('reflect-metadata');
require('./config/elastic');

const SearchService = require('./services/search.service')
// Instancier le service et appeler la méthode initIndex()
const searchService = new SearchService();
searchService.initIndex()
    .catch(err => console.error("Erreur lors de l'initialisation de l'index :", err));

const http = require('http');
const cluster = require('cluster');
const os = require('os');
const { Server } = require("socket.io");

const AppDataSource = require('./config/db');
//const { app, sessionMiddleware } = require('./app');
const appModule = require('./app');

const app = appModule.app || appModule; // si test → appModule = app
const sessionMiddleware = appModule.sessionMiddleware; // undefined en test (OK)

const PORT = process.env.PORT || 3000;

async function startServer() {
    await AppDataSource.initialize();
    console.log("Database connected");

    const httpServer = http.createServer(app);

    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true,
            methods: ["GET", "POST"]
        }
    });

    // Socket.IO middleware
    const wrap = middleware => (socket, next) =>
        middleware(socket.request, {}, next);

    io.use(wrap(sessionMiddleware));
    io.use(wrap(require('./config/passport').initialize()));
    io.use(wrap(require('./config/passport').session()));

    // Auth guard
    io.use((socket, next) => {
        if (socket.request.user) next();
        else next(new Error("Unauthorized"));
    });

    // Events
    io.on('connection', require('./socketHandlers'));

    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

if (cluster.isPrimary) {
    const cpuCount = os.availableParallelism();
    console.log(`Master running with ${cpuCount} workers`);

    for (let i = 0; i < cpuCount; i++) cluster.fork();

    cluster.on('exit', () => cluster.fork());
} else {
    startServer();
}
