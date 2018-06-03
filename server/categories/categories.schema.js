const Joi = require('joi');

const CategoriesSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
    name: Joi.string().required()
});

module.exports = CategoriesSchema;