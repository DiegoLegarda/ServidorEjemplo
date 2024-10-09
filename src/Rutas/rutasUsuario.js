const express = require('express');
const router = express.Router();
const usuario = require('../Controladores/controladoresUsuario');

// Rutas para /api/usuarios
router.get('/', usuario.obtenerUsuarios);
router.get('/:id', usuario.obtenerUsuarioPorId);
router.post('/', usuario.crearUsuario);
router.put('/:id', usuario.actualizarUsuario);
router.delete('/:id', usuario.eliminarUsuario);

module.exports = router;