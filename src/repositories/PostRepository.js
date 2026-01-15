const BaseRepository = require('../core/BaseRepository');
const Post = require('../entities/Post');

class PostRepository extends BaseRepository {

    constructor(dataSource) {
        super(Post, dataSource);
        this.postRepo = this.repo
    }
    IndexAll() {
        return this.repo.find();
    }
}
module.exports = PostRepository;
