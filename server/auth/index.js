const controller = require('./auth.controller');
const routes = require('./auth.routes');
const schema = require('./auth.schema');

module.exports = {
    initialize: controller.initialize,
    authenticationMiddleware: controller.authenticationMiddleware,
    routes,
    schema
};