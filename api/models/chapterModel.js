const db = require('../db').default;

const Chapter = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM parts');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM parts WHERE id = ?', [id]);
    return rows[0];
  },
  getByBookId: async (book_id) => {
    const [rows] = await db.query('SELECT * FROM parts WHERE book_id = ?', [book_id]);
    return rows;
  },

  create: async (chapterData) => {
    const { book_id, title, body } = chapterData;
    const [result] = await db.query(
      'INSERT INTO parts (book_id, title, body) VALUES (?, ?, ?)',
      [book_id, title, body]
    );
    return { id: result.insertId, ...chapterData };
  },

  update: async (id, chapterData) => {
    const { title, body } = chapterData;
    const [result] = await db.query(
      'UPDATE parts SET title = ?, body = ? WHERE id = ?',
      [title, body, id]
    );
    return result.affectedRows > 0;
  },
  incrementLikes: async (id) => {
    const [result] = await db.query('UPDATE parts SET likes = likes + 1 WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  incrementViews: async (id) => {
    const [result] = await db.query('UPDATE parts SET views = views + 1 WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM parts WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = Chapter;
