const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const DbContainer = require('./database');

const AuthModule = require('./server/auth');
const Routes = require('./server/routes');

const app = express();

const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

AuthModule.initialize(app);
Routes.setRoutes(app);

app.listen(port, () => {
  console.log(`listening on port ${port}!`);
});

function setCORS (req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  // Set custom headers for CORS
  res.header("Access-Control-Allow-Headers", "Content-type,Accept,X-Access-Token,X-User");
  if (req.method === "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
}