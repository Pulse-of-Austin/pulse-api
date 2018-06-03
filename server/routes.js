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

//######### ADMIN PORTAL ROUTES #################

router.post('/topic', (req, res) => {
  console.log(req.body)
  const { title, description, details, vote_date, image, categories } = req.body;
  db('topic').insert({
    title,
    description,
    details,
    vote_date,
    image,
  }, 'id')
    .then((topic_id) => {
      console.log(topic_id);
      categories.forEach(async (category_id) => {
        await db('topic_categories').insert({ topic_id, category_id });
      })
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(401);
    })
})

router.post('/categories', (req, res) => {
  console.log(req.body)
  const { category } = req.body;
  db('categories').insert({ category })
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(401);
    })
})

router.post('/perspectives', (req, res) => {
  console.log(req.body)
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