const config = require('config');

const db = require('knex')({
    client: 'pg',
    connection: config.get('knexConfig.connection')
});
  
module.exports = { db };
  