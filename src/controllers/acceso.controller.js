const { prisma } = require('../../db');
const bcrypt = require('bcrypt');

const verificarTokenAcceso = async (req, res) => {
    try {
        const { llave } = req.query;

        if (!llave) {
            return res.status(401).json({
                estado: "error",
                mensaje: "Acceso denegado. Se requiere llave de autorización."
            });
        }

        const usuario = await prisma.usuario.findUnique({
            where: { token_acceso: llave }
        });

        if (!usuario) {
            return res.status(401).json({
                estado: "error",
                mensaje: "Credenciales inválidas."
            });
        }

        return res.status(200).json({
            estado: "exito",
            data: {
                mensaje: `Bienvenido al sistema, ${usuario.nombre}`,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error("[ERROR CRÍTICO]:", error);
        return res.status(500).json({
            estado: "error",
            mensaje: "Fallo interno en el servidor. Contacte al administrador."
        });
    }
};

const registrarUsuario = async (req, res) => {
    try {
        const emailSaneado = req.body.email ? req.body.email.trim() : null;
        const passwordRaw = req.body.password ? req.body.password.trim() : null;
        const nombre = req.body.nombre ? req.body.nombre.trim() : null;
        const token_acceso = req.body.token_acceso ? req.body.token_acceso.trim() : `token_${Math.random().toString(36).substr(2, 9)}`;

        if (!emailSaneado || !passwordRaw) {
            return res.status(400).json({
                estado: "error",
                mensaje: "El correo (email) y la contraseña (password) son obligatorios."
            });
        }

        const passwordHash = await bcrypt.hash(passwordRaw, 10);

        const nuevoUsuario = await prisma.usuario.create({
            data: {
                nombre,
                email: emailSaneado,
                passwordHash,
                token_acceso
            }
        });

        const { passwordHash: _, ...usuarioResponse } = nuevoUsuario;

        return res.status(201).json({
            estado: "exito",
            data: usuarioResponse
        });

    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({
                estado: "error",
                mensaje: "Violación de restricción única: el correo electrónico o token de acceso ya existe."
            });
        }

        console.error("[ERROR CRÍTICO]:", error);
        return res.status(500).json({
            estado: "error",
            mensaje: "Fallo interno en el servidor. Contacte al administrador."
        });
    }
};

module.exports = { obtenerSaludo: verificarTokenAcceso, verificarTokenAcceso, registrarUsuario };
