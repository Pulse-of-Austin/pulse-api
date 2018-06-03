const express = require('express');
const { db } = require('../database/index');
const AuthModule = require('./auth');

const router = express.Router();

router.get('/test', (req, res) => res.json("Server is active."));
router.get('/protected', AuthModule.authenticateUserMiddleware, (req, res) => res.json("Got."));

router.use('/auth', AuthModule.routes);

function setRoutes (app) {
    app.all("/*", setCORS);
    app.use('/', router);
}

router.post('/topic', (req, res) => {
  console.log(req.body)
  const { description, details, vote_date, image } = req.body;
  return db('topic').insert({
    description,
    details,
    vote_date,
    image,
  });
})

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