/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/books', bookController.getBooks);
router.get('/book/:id', bookController.getBookById);
router.get('/:username/books', bookController.getBooksByUsername);
router.post('/book/create', bookController.createBook);
router.put('/book/update/:id', bookController.updateBook);
router.delete('/book/delete/:id', bookController.deleteBook);

module.exports = router;
