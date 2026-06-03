require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const verificarAccesoPrisma = async (req, res, next) => {
    const llaveRecibida = req.query.llave;

    try {
        const acceso = await prisma.acceso.findUnique({
            where: { tokenLlave: llaveRecibida }
        });

        if (acceso) {
            console.log(`[AUTH] Bienvenido, ${acceso.usuarioAsignado}`);
            next();
        } else {
            res.status(401).send('<h1>401 - Token Inválido</h1>');
        }
    } catch (error) {
        res.status(500).json({ error: "Error de conexión con Prisma" });
    }
};

module.exports = {
    prisma,
    verificarAccesoPrisma
};