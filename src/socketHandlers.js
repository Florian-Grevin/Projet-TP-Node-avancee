// socketHandlers.js
const AppDataSource = require('./config/db');

module.exports = (io) => {
    const messageRepository = AppDataSource.getRepository('Message');

    return async (socket) => {
        const user = socket.request.user;

        console.log(`🔌 Client connecté : ${socket.id} (${user.username})`);

        // Rejoindre les rooms
        socket.join(`user:${user.id}`);
        socket.join('general');

        console.log(`➡️ ${user.username} a rejoint user:${user.id} et general`);

        // --- PING / PONG ---
        socket.on('my_ping', (data) => {
            console.log(`PING reçu de ${user.username} :`, data);

            socket.emit('my_pong', {
                text: "Pong !",
                time: new Date().toLocaleTimeString()
            });
        });

        // --- CHAT GENERAL ---
        socket.on('send_message', async (data) => {
            try {
                if (!data.content || data.content.trim() === "") return;

                const newMessage = messageRepository.create({
                    content: data.content,
                    room: 'general',
                    sender: user
                });

                await messageRepository.save(newMessage);

                console.log(`💬 Message sauvegardé (ID: ${newMessage.id})`);

                io.to('general').emit('new_message', {
                    from: user.username,
                    content: newMessage.content,
                    time: newMessage.createdAt
                });

            } catch (error) {
                console.error('❌ Erreur sauvegarde message:', error);
                socket.emit('error', { message: "Impossible d'envoyer votre message." });
            }
        });

        // --- DECONNEXION ---
        socket.on('disconnect', () => {
            console.log(`❌ Utilisateur ${user.username} déconnecté`);
        });
    };
};
