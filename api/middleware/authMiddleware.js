const jwt = require('jsonwebtoken');
const { isBlacklisted } = require('./tokenBlacklist');
const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');

  // Verifica si el encabezado Authorization existe y tiene un valor
  if (!authHeader) {
    return res.status(401).json({ error: 'Acceso denegado, token faltante' });
  }

  try {
    // Verifica que el authHeader tenga el formato esperado antes de intentar usar replace
    let token;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '');
    } else {
      token = authHeader;
    }

    // Decodifica el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Almacena el token decodificado en req.user
    next();  // Pasa al siguiente middleware o ruta
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  if (isBlacklisted(token)) {
    return res.status(401).json({ message: 'Token is blacklisted' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware, authenticateToken;
