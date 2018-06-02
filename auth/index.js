const controller = require('./auth.controller');
const routes = require('./auth.routes');

module.exports = {
    initialize: controller.initialize,
    authenticationMiddleware: controller.authenticationMiddleware,
    routes
};