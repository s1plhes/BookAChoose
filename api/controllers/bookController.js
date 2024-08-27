/* eslint-disable no-undef */
const bookModel = require('../models/bookModel');
const { validateBook } = require('../validations/book'); // Asegúrate de que validateBook esté definido

exports.getBooks = async (req, res, next) => {
  try {
    const books = await bookModel.getAll();
    res.json(books);
  } catch (err) {
    next(err); // Pasar el error al middleware de manejo de errores
  }
};

exports.getBooksByUsername = async (req, res, next) => {
  const { username } = req.params;
  try {
    const books = await bookModel.getByAuthor(username);
    res.json(books);
  } catch (err) {
    next(err); // Pasar el error al middleware de manejo de errores
  }
};

exports.getBooksByAuthor = async (req, res, next) => {
  const { author } = req.params;
  try {
    const books = await bookModel.getByAuthor(author);
    res.json(books);
  } catch (err) {
    next(err); // Pasar el error al middleware de manejo de errores
  }
};

exports.getBookById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const book = await bookModel.getById(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    next(err); // Pasar el error al middleware de manejo de errores
  }
};

exports.createBook = async (req, res, next) => {
  const { title, author, description, image } = req.body;

  // Validar datos
  const { error } = validateBook(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const result = await bookModel.createBook({ title, author, description, image });
    res.status(201).json(result); // Usar código de estado 201 para creación exitosa
  } catch (err) {
    next(err); // Pasar el error al middleware de manejo de errores
  }
};

exports.updateBook = async (req, res, next) => {
  const { id } = req.params;
  const { title, author, description, image } = req.body;

  // Validar datos
  const { error } = validateBook(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const result = await bookModel.update(id, { title, author, description, image });
    if (!result) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book updated successfully' });
  } catch (err) {
    next(err); // Pasar el error al middleware de manejo de errores
  }
};

exports.deleteBook = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await bookModel.delete(id);
    if (!result) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book deleted' });
  } catch (err) {
    next(err); // Pasar el error al middleware de manejo de errores
  }
};
