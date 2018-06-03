const dbContainer = require('./db-container');
const _ = require('lodash');

function getUserByEmail (email) { 
    const promiseObj = new Promise(function(resolve, reject) {
        dbContainer.db('users').where('email', email).then(users => {
            resolve(_.head(users));
        }).catch(reject);
    });

    return promiseObj;
}

module.exports = { getUserByEmail };