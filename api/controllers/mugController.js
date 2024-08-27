const Mug = require('../models/mugModel');
const { mugSchema } = require('../validations/mug');

exports.getMugs = async (req, res) => {
  try {
    const mugs = await Mug.getAll();
    res.json(mugs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMugById = async (req, res) => {
  const { id } = req.params;
  try {
    const mug = await Mug.getById(id);
    if (!mug) {
      return res.status(404).json({ error: 'Mug not found' });
    }
    res.json(mug);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMug = async (req, res) => {
  const { error } = mugSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { image, title, price, desc, url } = req.body;
  try {
    const result = await Mug.create({ image, title, price, desc, url });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMug = async (req, res) => {
  const { error } = mugSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { id } = req.params;
  const { image, title, price, desc, url } = req.body;
  try {
    const result = await Mug.update(id, { image, title, price, desc, url });
    if (!result) {
      return res.status(404).json({ error: 'Mug not found' });
    }
    res.json({ message: 'Mug updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMug = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Mug.delete(id);
    if (!result) {
      return res.status(404).json({ error: 'Mug not found' });
    }
    res.json({ message: 'Mug deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
