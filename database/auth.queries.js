const { db } = require('./db-container');

function signup (userData) {
    return db('users').insert(userData);
}

module.exports = { signup };