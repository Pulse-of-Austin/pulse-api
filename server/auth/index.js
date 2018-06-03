const controller = require('./auth.controller');
const routes = require('./auth.routes');
const schema = require('./auth.schema');

module.exports = {
    ...controller,
    routes,
    schema
};