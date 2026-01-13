const bcrypt = require('bcryptjs');
class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async register(username, password) {
        // Validation basique
        if (!username || !password) {
            throw new Error('Username et password requis');
        }
        const isUserExist = await this.userRepository.findByUsername(username)
        if(isUserExist) {
            throw new Error('Username déjà pris');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userRepository.create({
            username,
            password: hashedPassword
        });
        return { id: user.id, username: user.username };

    }
    async validateUser(username, password) {
         const user = await this.userRepository.findByUsername(username)
        if(!user) return null
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null
        return { id: user.id, username: user.username };
    }
}
module.exports = AuthService;