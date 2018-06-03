const Joi = require('joi');

const UserSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    role: Joi.forbidden(),
    password: Joi.string().min(7).required(),
    zipcode: Joi.string().required(),
    gender: Joi.string().required(),
    age: Joi.number().integer().positive().required(),
    income: Joi.number().integer().positive().required()
});

module.exports = UserSchema;