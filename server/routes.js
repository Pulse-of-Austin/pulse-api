const express = require('express');
const Joi = require('joi');
const validator = require('express-joi-validation')({});

const { db } = require('../database');
const AuthModule = require('./auth');
const CategoriesModule = require('./categories');
const TopicModule = require('./topic');

const router = express.Router();

router.get('/test', (req, res) => res.json("Server is active."));
router.get('/protected', AuthModule.authenticateUserMiddleware, (req, res) => res.json("Got."));

router.use('/auth', AuthModule.routes);
router.use('/topic', TopicModule.routes);

function setRoutes (app) {
    app.all("/*", setCORS);
    app.use('/', router);
}

//######### ADMIN PORTAL ROUTES #################
router.post('/categories',
  AuthModule.authenticateAdminMiddleware,
  validator.body(CategoriesModule.schema.keys({ id: Joi.forbidden() })),
  (req, res) => {
    const category = req.body;
    db('categories').insert(category)
      .then(addedCategory => {
        return res.json(addedCategory);
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).send(err);
      })
  })

router.post('/perspectives', (req, res) => {
  console.log(req.body)
  const { perTitle: title, perTopic: topic_id, perDets: rationale } = req.body;
  db('perspectives').insert({
    title,
    topic_id,
    rationale,
  })
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(401);
    })
})

router.post('/milestones', (req, res) => {
  console.log(req.body)
  const { milTitle: title, milTopic: topic_id, milDets: description } = req.body;
  db('milestones').insert({
    title,
    topic_id,
    description,
  })
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(401);
    })
})

router.post('/details', (req, res) => {
  console.log(req.body)
  const { detailTitle: title, detailTopic: topic_id, detailsDetails: description, detailImage: image } = req.body;
  db('topic_details').insert({
    title,
    topic_id,
    description,
    image,
  })
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(401);
    })
})

// ########## GET ROUTES ################

router.get('/caroselTopic?:number', (req, res) => {
  const { number } = req.params;
  db('topic').orderBy('updated_at').limit(number)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.error(err);
    })
})

router.get('/topic?:id', (req, res) => {
  // will refactor for giant join table later... it's too early...
  const { id } = req.params;
  db('topic').where({ id })
    .then((topic) => {
      db('perspectives').where({ topic_id: id })
        .then((perspectives) => {
          db('milestones').where({ topic_id: id })
            .then((milestones) => {
              db('topic_details').where({ topic_id: id })
                .then((details) => {
                  const topicTotal = {
                    topic,
                    perspectives,
                    milestones,
                    details,
                  }
                  res.status(200).send(topicTotal);
                })
            })
        })
    })
    .catch((err) => {
      console.error(err);
    })
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