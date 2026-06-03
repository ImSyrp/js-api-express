require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const rutasAuth = require('./routes/auth.routes');
const rutasAcceso = require('./routes/acceso.routes');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use((req, res, next) => {
    console.log(`[AUDITORÍA DE RED] Entrada: ${req.method} -> Destino: ${req.url}`);
    next();
});

app.use('/api', rutasAuth);
app.use('/api', rutasAcceso);

app.use((req, res) => {
    res.status(404).json({ mensaje: "Recurso no encontrado" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`===============================================`);
    console.log(` PASARELA DE CONTROL ACCESO JWT EN LÍNEA (PORT: ${PORT}) `);
    console.log(` Servidor iniciado de forma segura por: Dylan y Josue David `);
    console.log(`===============================================`);
});
