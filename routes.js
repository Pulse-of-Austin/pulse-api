const express = require('express');
const AuthModule = require('./auth');
const passport = require('passport');

const router = express.Router();

router.get('/test', (req, res) => res.json("Server is active."));
router.get('/protected', AuthModule.authenticationMiddleware(), (req, res) => res.json("Got."));

router.use('/auth', AuthModule.routes);

function setRoutes (app) {
    app.all("/*", setCORS);
    app.use('/api', router);
}

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

module.exports = { setRoutes };