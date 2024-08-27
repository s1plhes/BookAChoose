const TShirt = require('../models/teeModel');
const { tshirtSchema } = require('../validations/tee');

exports.getTShirts = async (req, res) => {
  try {
    const tshirts = await TShirt.getAll();
    res.json(tshirts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTShirtById = async (req, res) => {
  const { id } = req.params;
  try {
    const tshirt = await TShirt.getById(id);
    if (!tshirt) {
      return res.status(404).json({ error: 'T-shirt not found' });
    }
    res.json(tshirt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTShirt = async (req, res) => {

  const { error } = tshirtSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { image, title, price, desc, url } = req.body;
  try {
    const result = await TShirt.create({ image, title, price, desc, url });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTShirt = async (req, res) => {
    const { error } = tshirtSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { id } = req.params;
  const { image, title, price, desc, url } = req.body;
  try {
    const result = await TShirt.update(id, { image, title, price, desc, url });
    if (!result) {
      return res.status(404).json({ error: 'T-shirt not found' });
    }
    res.json({ message: 'T-shirt updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTShirt = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await TShirt.delete(id);
    if (!result) {
      return res.status(404).json({ error: 'T-shirt not found' });
    }
    res.json({ message: 'T-shirt deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
