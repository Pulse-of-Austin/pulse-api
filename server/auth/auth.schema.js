const Joi = require('joi');

const AuthSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
});

module.exports = AuthSchema;