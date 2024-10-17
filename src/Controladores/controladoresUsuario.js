const Usuario = require('../Modelos/modeloUsuario');

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Obtener un usuario por ID
const obtenerUsuarioPorId = async (req, res) => {
  try {
    
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Crear un nuevo usuario
const crearUsuario = async (req, res) => {
  const { nombre, correo, contraseña } = req.body;
  console.log(req.body);
  const nuevoUsuario = new Usuario({
    nombre,
    correo,
    contraseña
  });

  try {
    const usuarioGuardado = await nuevoUsuario.save();
    res.status(201).json(usuarioGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

// Actualizar un usuario existente
const actualizarUsuario = async (req, res) => {
  try {
    
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado para actualizar' });
    }

    const { nombre, correo, contraseña } = req.body;

    if (nombre) usuario.nombre = nombre;
    if (correo) usuario.correo = correo;
    if (contraseña) usuario.contraseña = contraseña;

    const usuarioActualizado = await usuario.save();
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

// Eliminar un usuario
const eliminarUsuario = async (req, res) => {
    try {
      const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
      
      if (!usuarioEliminado) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
  
      res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  };

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};