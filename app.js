require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Registro de actividad en la consola
app.use((req, res, next) => {
    const tiempo = new Date().toISOString();

    console.log(
        `[LOG] ${tiempo} - Método: ${req.method} - URL: ${req.url}`
    );

    next();
});

// Middleware de validación con PostgreSQL
const validarAcceso = async (req, res, next) => {

    const token = req.query.token;

    if (!token) {

        return res.status(401).send(`
            <h1>401 - No autorizado</h1>
            <p>Debe enviar un token.</p>
        `);

    }

    try {

        const sql = `
            SELECT *
            FROM llaves_acceso
            WHERE token_llave = $1
        `;

        const resultado = await db.query(sql, [token]);

        if (resultado.rows.length > 0) {

            console.log(
                `[AUTH] Acceso válido para: ${resultado.rows[0].usuario_asignado}`
            );

            next();

        } else {

            return res.status(401).send(`
                <h1>401 - No autorizado</h1>
                <p>Token inválido</p>
            `);

        }

    } catch (error) {

        console.error('Error SQL:', error);

        return res.status(500).json({
            error: 'Error interno del servidor',
            mensaje: 'Error en la validación del token'
        });

    }

};

// Rutas
app.get('/api/saludo', (req, res) => {

    res.json({
        mensaje: "¡Hola desde el backend de la Casimiro Sotelo!",
        estudiante1: "Dylan",
        estudiante2: "Josue David",
        universidad: "UNCSM",
        unidad: "Unidad II: Herramientas para el desarrollo Web"
    });

});

app.get('/search', (req, res) => {

    const termino = req.query.termino || 'No especificado';
    const categoria = req.query.categoria || 'No especificado';

    res.json({
        termino,
        categoria
    });

});

app.get('/users/:id', (req, res) => {

    const id = req.params.id;

    res.json({
        usuario: id
    });

});

// Ruta protegida
app.get('/api/recurso', validarAcceso, (req, res) => {

    res.json({
        estado: "conexion exitosa",
        data: "Este es un mensaje protegido desde el Backend",
        timestamp: new Date()
    });

});

// Middleware 404
app.use((req, res) => {

    res.status(404).send(`
        <h2>Error 404: Recurso no encontrado</h2>
        <p>La ruta solicitada no existe en este servidor.</p>
    `);

});

// Middleware de errores
app.use((err, req, res, next) => {

    console.error(err.stack);

    res.status(500).json({
        error: 'Error interno del servidor',
        mensaje: 'Algo salió mal. Por favor, inténtalo de nuevo más tarde.'
    });

});

// Servidor
app.listen(PORT, () => {

    console.log(`Servidor corriendo en http://localhost:${PORT}`);

});