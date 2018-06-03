const schema = require('./topic.schema');
const controller = require('./topic.controller');
const routes = require('./topic.routes');

module.exports = {
    ...controller,
    schema,
    routes
};