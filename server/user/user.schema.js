const Joi = require('joi');

const UserSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
    email: Joi.string().email().required(),
    name: Joi.string(),
    role: Joi.forbidden(),
    password: Joi.string().min(7).required(),
    zipcode: Joi.string(),
    gender: Joi.string(),
    age: Joi.number().integer().positive(),
    income: Joi.number().integer().positive()
});

module.exports = UserSchema;