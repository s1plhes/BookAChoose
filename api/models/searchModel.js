// models/searchModel.js
const db = require('../db').default;

class Search {
    static async search(query) {

        const sanitizeQuery = (query) => {
            return query.replace(/[^a-zA-Z0-9\s]/g, '');
        };
        const sql = `
            SELECT 
                books.id AS book_id, 
                books.title AS book_title, 
                users.id AS user_id, 
                users.name AS user_name
            FROM books
            LEFT JOIN users ON users.name = books.author
            WHERE books.title LIKE ? OR users.name LIKE ?
        `;
        const results = await db.query(sql, [`%${sanitizeQuery(query)}%`, `%${sanitizeQuery(query)}%`]);
        return results;
    }
}

module.exports = Search;