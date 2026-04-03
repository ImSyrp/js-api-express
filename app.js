const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

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