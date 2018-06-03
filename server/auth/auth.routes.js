const router = require('express').Router();
const Joi = require('joi');
const validator = require('express-joi-validation')({});

const AuthController = require('./auth.controller');
const UserSchema = require('../user/user.schema');

router.post('/login', AuthController.login);
router.post('/signup', validator.body(UserSchema.keys({ id: Joi.forbidden() })), AuthController.signup);

module.exports = router;
