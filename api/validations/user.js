const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string()
    .alphanum()
    .min(4)
    .max(25)
    .required()
    .messages({
      'string.base': 'Name must be a string',
      'string.alphanum': 'Name must only contain alphanumeric characters',
      'string.min': 'Name must be at least 4 characters long',
      'string.max': 'Name must be at most 25 characters long',
      'any.required': 'Name is required'
    }),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$"))
    .required()
    .messages({
      'string.pattern.base': 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required'
    }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }) // Consider removing tlds for wider applicability
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required'
    }),
  avatar: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'Avatar must be a valid URL'
    })
});

module.exports = { userSchema };
