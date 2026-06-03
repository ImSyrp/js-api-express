const express = require('express');
const router = express.Router();
const accesoController = require('../controllers/acceso.controller');

const { protegerRuta } = require('../middlewares/auth.middleware');

router.get('/saludo', protegerRuta, accesoController.verificarTokenAcceso);
router.post('/registro', accesoController.registrarUsuario);

module.exports = router;
