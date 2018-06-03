function createTable (knex, tableName, columnCallback, opts) {
    return knex.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            return knex.schema.createTable(tableName, table => {
                table.increments('id').primary();
                columnCallback(table);
                if (!opts || (opts && !opts.removeTs)) {
                    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
                    table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
                }
            }).then(
                () => { console.log(`Created ${tableName} table`); }
            ).catch(err => console.error(err));
        }
        return;
    });
}

function dropTable (knex, tableName) {
    return knex.schema.hasTable(tableName).then(exists => {
        if (exists) {
            return knex.schema.dropTable(tableName).then(
                () => { console.log(`Dropped ${tableName} table`); }
            ).catch(err => console.error(err));
        }
        return;
    });
}


exports.up = function(knex, Promise) {
    return createTable(knex, 'users', table => {
        table.string('name');
        table.string('password');
        table.string('email').defaultTo(null).unique();
        table.string('role').defaultTo('user').notNull(),
        table.string('zipcode');
        table.string('gender');
        table.integer('age');
        table.integer('income');
    }).then(
        () => {
            return createTable(knex, 'categories', table => {
                table.string('name');
            });
        }
    ).then(
        () => {
            return createTable(knex, 'categories_users', table => {
                table.integer('user_id').references('users.id');
                table.integer('category_id').references('categories.id');
            });
        }
    ).then(
        () => {
            return createTable(knex, 'topic', table => {
                table.string('description');
                table.string('details');
                table.integer('vote_date');
                table.string('image');
            });
        }
    ).then(
        () => {
            return createTable(knex, 'topic_categories', table => {
                table.integer('topic_id').references('topic.id');
                table.integer('category_id').references('categories.id');
            }, {removeTs: true});
        }
    ).then(
        () => {
            return createTable(knex, 'poll', table => {
                // Nothing
            }, {removeTs: true});
        }
    ).then(
        () => {
            return createTable(knex, 'topic_poll', table => {
                table.integer('topic_id').references('topic.id');
                table.integer('poll_id').references('poll.id');
            }, {removeTs: true});
        }
    ).then(
        () => {
            return createTable(knex, 'user_topic', table => {
                table.integer('topic_id').references('topic.id');
                table.integer('user_id').references('users.id');
            }, {removeTs: true});
        }
    ).then(
        () => {
            return createTable(knex, 'user_pollVotes', table => {
                table.integer('user_id').references('users.id');
                table.integer('poll_id').references('poll.id');
            }, {removeTs: true});
        }
    ).then(
        () => {
            return createTable(knex, 'perspectives', table => {
                table.integer('topic_id').references('topic.id');
                table.string('rationale');
            }, {removeTs: true});
        }
    ).then(
        () => {
            return createTable(knex, 'milestones', table => {
                table.integer('topic_id').references('topic.id');
                table.string('description');
            }, {removeTs: true});
        }
    ).then(
        () => {
            return createTable(knex, 'topic_details', table => {
                table.integer('topic_id').references('topic.id');
                table.string('image');
                table.string('description');
            }, {removeTs: true});
        }
    );
};

exports.down = function(knex, Promise) {
  return dropTable(knex, 'topic_details').then(
        () => dropTable(knex, 'milestones')
    ).then(
        () => dropTable(knex, 'perspectives')
    ).then(
        () => dropTable(knex, 'user_pollVotes')
    ).then(
        () => dropTable(knex, 'user_topic')
    ).then(
        () => dropTable(knex, 'topic_poll')
    ).then(
        () => dropTable(knex, 'poll')
    ).then(
        () => dropTable(knex, 'topic_categories')
    ).then(
        () => dropTable(knex, 'topic')
    ).then(
        () => dropTable(knex, 'categories_users')
    ).then(
        () => dropTable(knex, 'categories')
    ).then(
        () => dropTable(knex, 'users')
    );
};
