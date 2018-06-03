const { db } = require('./db-container');

function signup (userData) {
    return db('users').insert(userData, ['id', 'email', 'name', 'zipcode', 'gender', 'age', 'income']);
}

module.exports = { signup };