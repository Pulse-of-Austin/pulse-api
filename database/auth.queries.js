const dbContainer = require('./db-container');

function signup (userData) {
    return dbContainer.db('users').insert(userData);
}

module.exports = { signup };