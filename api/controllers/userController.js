const userModel = require('../models/userModel');
const { userSchema } = require('../validations/user');
const getUsers = async (req, res) => {
  try {
    const [rows] = await userModel.getAllUsers();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getUserByName = async (req, res) => {
  const { username } = req.params;
  try {
    const [rows] = await userModel.getUserByName(username);
    if (rows.length === 0) {
      return res.status(404).json({ error: '[API UserC]user not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await userModel.getUserById(id);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching user by ID:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createUser = async (req, res) => {

  //Manage data
  const { name, password, email, lvl } = req.body;
  if (!name || !password || !email || !lvl) {
    return res.status(400).json({ error: '[API UserC]Faltan campos requeridos' });
  }
  try {
    const [result] = await userModel.createUser(name, password, email, lvl);
    res.json({ id: result.insertId, name, password, email, lvl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  //Validate Data
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  //Manage data
  const { id } = req.params;
  const { name, password, email, avatar } = req.body;
  try {
    const [result] = await userModel.updateUser(id, name, password, email, avatar);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '[API UserC]user not found' });
    }
    res.json({ message: '[API UserC]user updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await userModel.deleteUser(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '[API UserC]user not found' });
    }
    res.json({ message: '[API UserC]user deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUsers, getUserByName, getUserById, createUser, updateUser, deleteUser };
