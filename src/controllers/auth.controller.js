const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { prisma } = require('../../db');

const login = async (req, res) => {
    try {
        const emailSaneado = req.body.email ? req.body.email.trim() : null;
        const passwordRaw = req.body.password ? req.body.password.trim() : null;

        if (!emailSaneado || !passwordRaw) {
            return res.status(400).json({
                codigo: 400,
                estado: "Bad Request",
                error: 'Parámetros inválidos o insuficientes.'
            });
        }

        const usuario = await prisma.usuario.findUnique({
            where: { email: emailSaneado }
        });

        if (!usuario) {
            return res.status(401).json({
                codigo: 401,
                estado: "No Autorizado",
                error: 'Credenciales de acceso incorrectas.'
            });
        }

        const passwordValido = await bcrypt.compare(passwordRaw, usuario.passwordHash);
        if (!passwordValido) {
            return res.status(401).json({
                codigo: 401,
                estado: "No Autorizado",
                error: 'Credenciales de acceso incorrectas.'
            });
        }

        const payload = {
            id: usuario.id,
            usuario: usuario.nombre || usuario.email,
            rol: 'Administrador',
            carrera: 'Ingeniería en Sistemas',
            token_acceso: usuario.token_acceso
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h'
        });

        return res.status(200).json({
            codigo: 200,
            estado: "OK",
            mensaje: "Autenticación satisfactoria. Token de sesión generado.",
            token: token
        });

    } catch (error) {
        console.error('[LOG-INTERNO-PRODUCCIÓN]:', error.message);
        return res.status(500).json({
            codigo: 500,
            estado: "Internal Server Error",
            error: 'Error interno en el procesamiento del servicio.'
        });
    }
};

module.exports = { login };
