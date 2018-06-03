const router = require('express').Router();
const Joi = require('joi');
const validator = require('express-joi-validation')({});

const TopicController = require('./topic.controller');
const TopicSchema = require('./topic.schema');
const AuthModule = require('../auth');

router.post(
    '/',
    AuthModule.authenticateAdminMiddleware,
    validator.body(TopicSchema.keys({ id: Joi.forbidden() })),
    TopicController.addTopic
);

module.exports = router;
