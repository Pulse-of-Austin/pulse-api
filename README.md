# pulse API
API of Pulse of Austin app.

## Setup

1. Install concurrently with the command `npm install -g concurrently`
2. In your project root, use the command `npm install` to install the dependencies
3. Add `development.json` in the `config` directory in this format:
```
    {
        "env": "development",
        "knexConfig": {
            "client": "pg",
            "connection": {
                "host": "<YOUR HOST>",
                "user": "<YOUR USER>",
                "password": "<YOUR PASSWORD>",
                "database": "<YOUR DATABASE>"
            },
            "migrations": {
                "tableName": "pulse_knex_migrations"
            }
        }
    }
```
4. To run the server, use the command `npm run dev`