const db = require('../db').default;

const TShirt = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM tshirts');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM tshirts WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (tshirtData) => {
    const { image, title, price, desc, url } = tshirtData;
    const [result] = await db.query(
      'INSERT INTO tshirts (image, title, price, desc, url) VALUES (?, ?, ?, ?, ?)',
      [image, title, price, desc, url]
    );
    return { id: result.insertId, ...tshirtData };
  },

  update: async (id, tshirtData) => {
    const { image, title, price, desc, url } = tshirtData;
    const [result] = await db.query(
      'UPDATE tshirts SET image = ?, title = ?, price = ?, desc = ?, url = ? WHERE id = ?',
      [image, title, price, desc, url, id]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM tshirts WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = TShirt;
