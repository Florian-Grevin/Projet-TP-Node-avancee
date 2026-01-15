const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Post',
    tableName: 'posts',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: 'increment',
        },
        title: {
            type: 'varchar',
            length: 255,
        },
        content: {
            type: 'text',
        },
        tags: {
            type: 'simple-array',
        },
        created_at: {
            type: 'datetime',
            createDate: false,
            updateDate: false,
        },
    },
});
