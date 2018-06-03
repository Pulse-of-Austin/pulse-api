# pulse API
API of Pulse of Austin app.

## Setup

1. In your project root, use the command `npm install` to install the dependencies
2. Add `development.json` in the `config` directory in this format:
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
3. Run the migration with the command `npm run migrate:latest:dev` to update your local database
4. Run the server with the command `npm run dev`

## Launching an EC2 API Server

1. SSH into your newly created SSh Server
2. Run these series of commands
```
sudo yum update
sudo yum install nginx -y
service nginx status
curl --silent --location https://rpm.nodesource.com/setup_10.x | sudo bash -
sudo yum -y install nodejs
node -v
npm -v
sudo mkdir /opt/pulse-api
sudo chown ec2-user -R /etc/nginx/default.d
sudo chown ec2-user -R /opt/pulse-api
```
3. Edit or create a configuration via `sudo nano /etc/nginx/conf.d/default.conf` and paste the config from `deployment/nginx.staging.conf`
4. In AWS, edit the security group of the RDS to give the EC2 access
5. If no build and deploy exists, copy the contents of the API server into `/opt/pulse-api`
6. Run the following commands in your EC2

```
cd /opt/pulse-api
sudo chkconfig nginx on
sudo service nginx start
npm run pm2:staging
```