// errorMiddleware.js

const errorMiddleware = (err, req, res, next) => {
    // Si el error tiene un código de estado específico, usarlo; de lo contrario, usar 500 (Error Interno del Servidor)
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'; z

    // Registrar el error en la consola para depuración
    console.error(`Error: ${message}`);
    console.error(err.stack);

    // Enviar la respuesta al cliente
    res.status(statusCode).json({
        error: {
            message,
            // Agregar detalles del error si es necesario (solo en entornos de desarrollo)
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

module.exports = errorMiddleware;
