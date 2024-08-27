const Joi = require('joi');

const bookSchema = Joi.object({
  title: Joi.string()
    .min(4)
    .max(100)
    .required()
    .messages({
      'string.base': 'Title should be a string',
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title should have a minimum length of 4 characters',
      'string.max': 'Title should have a maximum length of 100 characters',
      'any.required': 'Title is required'
    }),

  author: Joi.string()
    .min(4)
    .max(25)
    .required()
    .messages({
      'string.base': 'Author should be a string',
      'string.empty': 'Author cannot be empty',
      'string.min': 'Author should have a minimum length of 4 characters',
      'string.max': 'Author should have a maximum length of 25 characters',
      'any.required': 'Author is required'
    }),

  description: Joi.string()
    .min(10)
    .max(655)
    .required()
    .messages({
      'string.base': 'Description should be a string',
      'string.empty': 'Description cannot be empty',
      'string.min': 'Description should have a minimum length of 10 characters',
      'string.max': 'Description should have a maximum length of 655 characters',
      'any.required': 'Description is required'
    }),

  image: Joi.string()
    .uri()  // Asumiendo que la imagen es una URL
    .min(10)
    .max(655)
    .required()
    .messages({
      'string.base': 'Image should be a string',
      'string.empty': 'Image cannot be empty',
      'string.min': 'Image URL should have a minimum length of 10 characters',
      'string.max': 'Image URL should have a maximum length of 655 characters',
      'string.uri': 'Image should be a valid URL',
      'any.required': 'Image is required'
    })
});

const validateBook = (data) => {
  return bookSchema.validate(data, { abortEarly: false });
};

module.exports = { bookSchema, validateBook };
