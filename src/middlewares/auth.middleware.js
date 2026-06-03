const jwt = require('jsonwebtoken');

const protegerRuta = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            codigo: 401,
            estado: "No Autorizado",
            mensaje: "Acceso denegado. Se requiere una cabecera HTTP de tipo 'Bearer '."
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = decoded;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                codigo: 401,
                estado: "No Autorizado",
                mensaje: "El token provisto ha expirado. Por favor, realice un nuevo login."
            });
        }

        return res.status(403).json({
            codigo: 403,
            estado: "Prohibido",
            mensaje: "Token corrupto, inválido o modificado de manera maliciosa. Acceso revocado."
        });
    }
};

module.exports = { protegerRuta };
