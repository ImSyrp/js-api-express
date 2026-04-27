app.use(express.json());
require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.static(path.join(__dirname, 'public')));


// Registro de actividad en la consola

app.use((req, res, next) => {
    const tiempo = new Date().toISOString();
    console.log(`[LOG] ${tiempo} - Método: ${req.method} - URL: ${req.url}`);
    next();
});



const validarAcceso = (req, res, next) => {
    const token = req.query.token;

    if (token === 'admin123') {
        next();
    } else {
        res.status(401).send('<h1>No autorizado</h1><p>Token inválido</p>');
    }
};

app.get('/api/saludo', (req, res) => {
    res.json({
        mensaje: "¡Hola desde el backend de la Casimiro Sotelo!",
        estudiante1: "Dylan",
        estudiante2: "Josue David",
        universidad: "UNCSM",
        unidad: "Unidad II: Herramientas para el desarrollo Web"
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});