require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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

  res.json({ termino, categoria });
});

app.get('/users/:id', (req, res) => {
  const id = req.params.id;

  res.json({ usuario: id });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});