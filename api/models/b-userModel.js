const db = require('../db').default;

const getAllUsers = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM users');
        return rows;
    } catch (error) {
        throw new Error('Error retrieving users: ' + error.message);
    }
};

const getUserByName = async (username) => {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE name = ? LIMIT 1', [username]);
        return rows[0]; // Retorna el primer usuario encontrado
    } catch (error) {
        throw new Error('[Model]Error retrieving user by name: ' + error.message);
    }
};

const getUserById = async (id) => {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
        return rows[0]; // Retorna el usuario encontrado
    } catch (error) {
        throw new Error('Error retrieving user by ID: ' + error.message);
    }
};

const createUser = async (name, password, email, lvl) => {
    try {
        const [result] = await db.query('INSERT INTO users (name, password, email, lvl) VALUES (?, ?, ?, ?)', [name, password, email, lvl]);
        return { id: result.insertId }; // Retorna el ID del usuario creado
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
};

const updateUser = async (id, { name, email, avatar, password }) => {
    try {
        if (password) {
            // Si la contraseña fue proporcionada, inclúyela en la actualización
            const [result] = await db.query('UPDATE users SET name = ?, email = ?, avatar = ?, password = ? WHERE id = ?', [name, email, avatar, password, id]);
            return result.affectedRows > 0; // Retorna verdadero si se actualizó al menos una fila
        }
        // Si la contraseña no fue proporcionada, no la actualices
        const [result] = await db.query('UPDATE users SET name = ?, email = ?, avatar = ? WHERE id = ?', [name, email, avatar, id]);
        return result.affectedRows > 0; // Retorna verdadero si se actualizó al menos una fila
    } catch (error) {
        throw new Error('Error updating user: ' + error.message);
    }
};

const deleteUser = async (id) => {
    try {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows > 0; // Retorna verdadero si se eliminó al menos una fila
    } catch (error) {
        throw new Error('Error deleting user: ' + error.message);
    }
};

module.exports = { getAllUsers, getUserByName, getUserById, createUser, updateUser, deleteUser };
