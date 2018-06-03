const dbContainer = require('./db-container');
const UserQueries = require('./user.queries');
const AuthQueries = require('./auth.queries');

module.exports = {
    db: dbContainer.db,
    queries: {
        UserQueries,
        AuthQueries
    }
};
