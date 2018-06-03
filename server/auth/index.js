const controller = require('./auth.controller');
const routes = require('./auth.routes');
const schema = require('./auth.schema');

module.exports = {
    initialize: controller.initialize,
    authenticateUserMiddleware: controller.authenticateUserMiddleware,
    routes,
    schema
};