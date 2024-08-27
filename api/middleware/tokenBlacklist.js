// middleware/tokenBlacklist.js
const blacklist = new Set(); // Usa una base de datos o cache para producción

const isBlacklisted = (token) => {
    return blacklist.has(token);
};

const addToBlacklist = (token) => {
    blacklist.add(token);
};

module.exports = { isBlacklisted, addToBlacklist };
