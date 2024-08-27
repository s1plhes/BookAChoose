const Joi = require('joi');

const mugSchema = Joi.object({
  image: Joi.string().uri().required(),
  title: Joi.string().min(3).max(100).required(),
  price: Joi.number().positive().required(),
  desc: Joi.string().min(10).max(500).required(),
  url: Joi.string().uri().required(),
});

module.exports = { mugSchema };
