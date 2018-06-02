const knex = require('knex')({
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST || '127.0.0.1',
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    },
  });
  
  console.log('test');
  
  knex.schema.hasTable('users').then((exists) => {
    if (!exists) {
      knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('name');
        table.string('password');
        table.string('email').defaultTo(null).unique();
        table.integer('zipcode');
        table.string('gender');
        table.integer('age');
        table.integer('income');
        table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
        table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
      }).then(() => {
        console.log('Created Table users');
      });
    }
  })
    .then(() => {
      knex.schema.hasTable('categories').then((exists) => {
        if (!exists) {
          knex.schema.createTable('categories', (table) => {
            table.increments('id').primary();
            table.string('name');
            table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
            table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
          })
            .then(() => { console.log('Created categories table'); })
            .catch((err) => { console.error(err); });
        }
      });
    })
    .then(() => {
      knex.schema.hasTable('categories_users').then((exists) => {
        if (!exists) {
          knex.schema.createTable('categories_users', (table) => {
            table.increments('id').primary();
            table.integer('user_id').references('users.id');
            table.integer('category_id').references('categories.id');
            table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
            table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
          })
            .then(() => { console.log('Created users_categories table'); })
            .catch((err) => { console.error(err); });
        }
      });
    })
    .then(() => {
      knex.schema.hasTable('topic').then((exists) => {
        if (!exists) {
          knex.schema.createTable('topic', (table) => {
            table.increments('id').primary();
            table.string('description');
            table.string('details');
            table.integer('vote_date');
            table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
            table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
          })
            .then(() => { console.log('Created topic table'); })
            .catch((err) => { console.error(err); });
        }
      });
    })
    .then(() => {
      knex.schema.hasTable('topic_categories').then((exists) => {
        if (!exists) {
          knex.schema.createTable('topic_categories', (table) => {
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
      knex.schema.hasTable('poll').then((exists) => {
        if (!exists) {
          knex.schema.createTable('poll', (table) => {
            table.increments('id').primary();
          })
            .then(() => { console.log('Created poll table'); })
            .catch((err) => { console.error(err); });
        }
      });
    })
    .then(() => {
      knex.schema.hasTable('topic_poll').then((exists) => {
        if (!exists) {
          knex.schema.createTable('topic_poll', (table) => {
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
      knex.schema.hasTable('user_topic').then((exists) => {
        if (!exists) {
          knex.schema.createTable('user_topic', (table) => {
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
      knex.schema.hasTable('user_pollVotes').then((exists) => {
        if (!exists) {
          knex.schema.createTable('user_pollVotes', (table) => {
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
    });
  
  module.exports = knex;
  