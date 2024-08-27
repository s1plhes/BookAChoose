const ChapterModel = require('../models/chapterModel');
const { chapterSchema, validateChapter } = require('./../validations/chapter'); // Asegúrate de que validateChapter esté definido

exports.getChapters = async (req, res, next) => {
  try {
    const chapters = await ChapterModel.getAll();
    res.json(chapters);
  } catch (err) {
    next(err); // Pasar el error al middleware de manejo de errores
  }
};

exports.getChapterByBookId = async (req, res, next) => {
  const { book_id } = req.params;
  try {
    const chapters = await ChapterModel.getByBookId(book_id);
    if (!chapters.length) {
      return res.status(404).json({ error: 'No chapters found' });
    }
    res.json(chapters);
  } catch (err) {
    next(err); // Pasar el error al middleware de manejo de errores
  }
};

exports.getChapterById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const chapter = await ChapterModel.getById(id);
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    res.json(chapter);
  } catch (err) {
    next(err); // Pasar el error al middleware de manejo de errores
  }
};

exports.createChapter = async (req, res, next) => {
  const { book_id, title, body } = req.body;

  // Validar datos
  const { error } = validateChapter(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const result = await ChapterModel.create({ book_id, title, body });
    res.status(201).json(result); // Usar código de estado 201 para creación exitosa
  } catch (err) {
    next(err); // Pasar el error al middleware de manejo de errores
  }
};

exports.updateChapter = async (req, res, next) => {
  const { id } = req.params;
  const { title, body } = req.body;

  // Validar datos
  const { error } = validateChapter(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const result = await ChapterModel.update(id, { title, body });
    if (!result) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    res.json({ message: 'Chapter updated successfully' });
  } catch (err) {
    next(err); // Pasar el error al middleware de manejo de errores
  }
};

exports.deleteChapter = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await ChapterModel.delete(id);
    if (!result) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    res.json({ message: 'Chapter deleted successfully' });
  } catch (err) {
    next(err); // Pasar el error al middleware de manejo de errores
  }
};

exports.incrementViews = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await ChapterModel.incrementViews(id);
    if (!result) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    res.json({ message: 'View count incremented successfully' });
  } catch (error) {
    next(error); // Pasar el error al middleware de manejo de errores
  }
};

exports.incrementLikes = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await ChapterModel.incrementLikes(id);
    if (!result) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    res.json({ message: 'Like count incremented successfully' });
  } catch (error) {
    next(error); // Pasar el error al middleware de manejo de errores
  }
};
