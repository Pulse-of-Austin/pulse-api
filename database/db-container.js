const config = require('config');

const db = require('knex')({
    client: 'pg',
    connection: config.get('knexConfig.connection')
});

function migrate(callback) {
    try {
        runMigration(db).then(() => {
            callback();
        });
    } catch (e) {
        throw "Database is not connected!";
    }
}


function runMigration(database) {
    return database.schema.hasTable('users').then((exists) => {
        if (!exists) {
          database.schema.createTable('users', (table) => {
            table.increments('id').primary();
            table.string('name');
            table.string('password');
            table.string('email').defaultTo(null).unique();
            table.integer('zipcode');
            table.string('gender');
            table.integer('age');
            table.integer('income');
            table.timestamp('created_at').notNullable().defaultTo(database.raw('now()'));
            table.timestamp('updated_at').notNullable().defaultTo(database.raw('now()'));
          }).then(() => {
            console.log('Created Table users');
          });
        }
      })
    .then(() => {
        database.schema.hasTable('categories').then((exists) => {
        if (!exists) {
            database.schema.createTable('categories', (table) => {
            table.increments('id').primary();
            table.string('name');
            table.timestamp('created_at').notNullable().defaultTo(database.raw('now()'));
            table.timestamp('updated_at').notNullable().defaultTo(database.raw('now()'));
            })
            .then(() => { console.log('Created categories table'); })
            .catch((err) => { console.error(err); });
        }
        });
    })
    .then(() => {
        database.schema.hasTable('categories_users').then((exists) => {
        if (!exists) {
            database.schema.createTable('categories_users', (table) => {
            table.increments('id').primary();
            table.integer('user_id').references('users.id');
            table.integer('category_id').references('categories.id');
            table.timestamp('created_at').notNullable().defaultTo(database.raw('now()'));
            table.timestamp('updated_at').notNullable().defaultTo(database.raw('now()'));
            })
            .then(() => { console.log('Created users_categories table'); })
            .catch((err) => { console.error(err); });
        }
        });
    })
    .then(() => {
        database.schema.hasTable('topic').then((exists) => {
        if (!exists) {
            database.schema.createTable('topic', (table) => {
            table.increments('id').primary();
            table.string('description');
            table.string('details');
            table.integer('vote_date');
            table.string('image');
            table.timestamp('created_at').notNullable().defaultTo(database.raw('now()'));
            table.timestamp('updated_at').notNullable().defaultTo(database.raw('now()'));
            })
            .then(() => { console.log('Created topic table'); })
            .catch((err) => { console.error(err); });
        }
        });
    })
    .then(() => {
        database.schema.hasTable('topic_categories').then((exists) => {
        if (!exists) {
            database.schema.createTable('topic_categories', (table) => {
            table.increments('id').primary();
            table.integer('topic_id').references('topic.id');
            table.integer('category_id').references('categories.id');
            })
            .then(() => { console.log('Created topic_categories table'); })
            .catch((err) => { console.error(err); });
        }
        });
    })
    .then(() => {
        database.schema.hasTable('poll').then((exists) => {
        if (!exists) {
            database.schema.createTable('poll', (table) => {
            table.increments('id').primary();
            })
            .then(() => { console.log('Created poll table'); })
            .catch((err) => { console.error(err); });
        }
        });
    })
    .then(() => {
        database.schema.hasTable('topic_poll').then((exists) => {
        if (!exists) {
            database.schema.createTable('topic_poll', (table) => {
            table.increments('id').primary();
            table.integer('topic_id').references('topic.id');
            table.integer('poll_id').references('poll.id');
            })
            .then(() => {
                console.log('Created topic_poll table');
            })
            .catch((err) => { console.error(err); });
        }
        });
    })
    .then(() => {
        database.schema.hasTable('user_topic').then((exists) => {
        if (!exists) {
            database.schema.createTable('user_topic', (table) => {
            table.increments('id').primary();
            table.integer('topic_id').references('topic.id');
            table.integer('user_id').references('users.id');
            })
            .then(() => { console.log('Created user_topic'); })
            .catch((err) => { console.error(err); });
        }
        });
    })
    .then(() => {
        database.schema.hasTable('user_pollVotes').then((exists) => {
        if (!exists) {
            database.schema.createTable('user_pollVotes', (table) => {
            table.increments('id').primary();
            table.integer('user_id').references('users.id');
            table.integer('poll_id').references('poll.id');
            })
            .then(() => {
                console.log('Created user_pollVotes table');
            })
            .catch((err) => { console.error(err); });
        }
        });
    })
    .then(() => {
        database.schema.hasTable('perspectives').then((exists) => {
            if (!exists) {
            database.schema.createTable('perspectives', (table) => {
                table.increments('id').primary();
                table.integer('topic_id').references('topic.id');
                table.string('rationale');
            })
                .then(() => {
                console.log('Created perspectives table');
                })
                .catch((err) => { console.error(err); });
            }
        });
        })
    .then(() => {
        database.schema.hasTable('milestones').then((exists) => {
            if (!exists) {
            database.schema.createTable('milestones', (table) => {
                table.increments('id').primary();
                table.integer('topic_id').references('topic.id');
                table.string('description');
            })
                .then(() => {
                console.log('Created milestones table');
                })
                .catch((err) => { console.error(err); });
            }
        });
    })
    .then(() => {
        database.schema.hasTable('topic_details').then((exists) => {
            if (!exists) {
                database.schema.createTable('topic_details', (table) => {
                    table.increments('id').primary();
                    table.integer('topic_id').references('topic.id');
                    table.string('image');
                    table.string('description');
                })
                    .then(() => {
                        console.log('Created topic_details table');
                    })
                    .catch((err) => { console.error(err); });
            }
        });
    });
}
  
module.exports = { migrate, db };
  