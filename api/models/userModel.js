const db = require('../db').default;

const getAllUsers = async () => await db.query('SELECT * FROM users');
const getUserByName = async (username) => await db.query('SELECT * FROM users WHERE name = ? LIMIT 1', [username]);
const getUserById = async (id) => await db.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
const createUser = async (name, password, email, lvl) =>
    await db.query('INSERT INTO users (name, password, email, lvl) VALUES (?, ?, ?, ?)', [name, password, email, lvl]);
const updateUser = async (id, name, password, email, avatar) =>
    await db.query('UPDATE users SET name = ?, password = ?, email = ?, avatar = ? WHERE id = ?', [name, password, email, avatar, id]);
const deleteUser = async (id) => await db.query('DELETE FROM users WHERE id = ?', [id]);

module.exports = { getAllUsers, getUserByName, getUserById, createUser, updateUser, deleteUser };
