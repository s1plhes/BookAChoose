const Joi = require('joi');

const chapterSchema = Joi.object({
    book_id: Joi.number().integer().required().messages({
        'number.base': 'Book ID should be a number',
        'number.integer': 'Book ID should be an integer',
        'any.required': 'Book ID is required'
    }),

    title: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.base': 'Title should be a string',
            'string.empty': 'Title cannot be empty',
            'string.min': 'Title should have a minimum length of 3 characters',
            'string.max': 'Title should have a maximum length of 100 characters',
            'any.required': 'Title is required'
        }),

    body: Joi.string()
        .min(10)
        .required()
        .messages({
            'string.base': 'Body should be a string',
            'string.empty': 'Body cannot be empty',
            'string.min': 'Body should have a minimum length of 10 characters',
            'any.required': 'Body is required'
        })
});

const validateChapter = (data) => {
    return chapterSchema.validate(data, { abortEarly: false });
};

module.exports = { chapterSchema, validateChapter };
