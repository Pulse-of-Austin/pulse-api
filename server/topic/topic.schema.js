const Joi = require('joi');

const UserSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    details: Joi.string(),
    vote_date: Joi.date(),
    image: Joi.string(),
    categories: Joi.array().min(1).required()
});

module.exports = UserSchema;