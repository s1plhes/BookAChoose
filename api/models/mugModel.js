const db = require('../db').default;

const Mug = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM mugs');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM mugs WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (mugData) => {
    const { image, title, price, desc, url } = mugData;
    const [result] = await db.query(
      'INSERT INTO mugs (image, title, price, desc, url) VALUES (?, ?, ?, ?, ?)',
      [image, title, price, desc, url]
    );
    return { id: result.insertId, ...mugData };
  },

  update: async (id, mugData) => {
    const { image, title, price, desc, url } = mugData;
    const [result] = await db.query(
      'UPDATE mugs SET image = ?, title = ?, price = ?, desc = ?, url = ? WHERE id = ?',
      [image, title, price, desc, url, id]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM mugs WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = Mug;
