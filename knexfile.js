// Update with your config settings.
const config = require('config');

module.exports = {
  [config.get('env')]: config.get('knexConfig')
};
