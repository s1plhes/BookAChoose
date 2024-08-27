/* eslint-disable no-undef */

const db = require('../db').default;

const Mug = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM books');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM books WHERE id = ?', [id]);
    return rows[0];
  },

  getByAuthor: async (username) => {
    const [rows] = await db.query('SELECT * FROM books WHERE author = ?', [username]);
    return rows;
  },
  createBook: async (data) => {
    const { title, author, description, image } = data;
    const [result] = await db.query(
      'INSERT INTO books (title, author, description, image) VALUES (?, ?, ?, ?)',
      [title, author, description, image]
    );
    return { id: result.insertId, ...data };
  },


  update: async (id, bookData) => {
    const { title, author, description, image } = bookData;
    const [result] = await db.query(
      `UPDATE books 
      SET title = ?, 
      author = ?, 
      description = ?, 
      image = ? 
      WHERE id = ?`,
      [title, author, description, image, id]
    );
    return result.affectedRows > 0;
  },


  delete: async (id) => {
    const [result] = await db.query('DELETE FROM books WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = Mug;
