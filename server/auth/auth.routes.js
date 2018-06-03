const router = require('express').Router();
const Joi = require('joi');
const validator = require('express-joi-validation')({});

const AuthController = require('./auth.controller');
const AuthSchema = require('./auth.schema');
const UserSchema = require('../user/user.schema');

router.post('/login', validator.body(AuthSchema), AuthController.login);
router.post('/signup', validator.body(UserSchema.keys({ id: Joi.forbidden() })), AuthController.signup);

module.exports = router;
