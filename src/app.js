const express = require('express');
const cors = require('cors');
const conectarDB = require('./BaseDatos/ConexionMongoDB');
const RutasUsuario = require('./Rutas/rutasUsuario');
const RutasUsername = require('./Rutas/rutasMongoDB');
const ValidarLogin = require('./Intermediarios/autenticacionDB')
const Token = require('./Intermediarios/tokenDB')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const dotenv = require('dotenv');
const puerto = process.env.PORT || 3000;
const app = express();

// Middleware para manejar JSON
app.use(express.json());

//Permitir acceso desde otras IP
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Middleware para manejar datos de formularios
app.use(express.urlencoded({ extended: true }));

//Middleware para parsear cookie
app.use(cookieParser());

// ruta get "hola mundo"
app.get('/', (req, res) => {
    res.send('Hola mundo');
});
// ruta get "adios mundo"
app.get('/adios', (req, res) => {
    res.send('Adios mundo');
});

//ruta saludo con nombre de entrada
app.get('/saludo/:nombre', (req, res) => {
    const nombre = req.params.nombre;
    res.send(`Hola ${nombre}`);
});


//*************************************** */
//      Manejo de usuarios en un arreglo
const usuarios = [
    { id: 1, nombre: 'Juan', email: 'juan@example.com' },
    { id: 2, nombre: 'Ana', email: 'ana@example.com' }
];

// vamos a crear un midleware para validación de datos
const validarDatos = (req, res, next) => {
    const nombre = req.body.nombre;
    const email = req.body.email;
    console.log(nombre);
    console.log(email);
    if (nombre && email) {
        next();
    } else {
        if (!nombre) {
            res.status(400).send('Falta el nombre');
        }
        if (!email) {
            res.status(400).send('Falta el email');
        }
    }
};

// Rutas para manipular el arreglo "usuarios"
app.get('/api/usuarios', (req, res) => res.json(usuarios));

app.post('/api/usuarios', validarDatos, (req, res) => {
    const nuevoUsuario = { id: usuarios.length + 1, ...req.body };
    usuarios.push(nuevoUsuario);
    res.status(201).json(nuevoUsuario);
});

app.put('/api/usuarios/:id', (req, res) => {
    const usuario = usuarios.find(u => u.id == req.params.id);
    if (!usuario) return res.status(404).send('Usuario no encontrado');
    Object.assign(usuario, req.body);
    res.json(usuario);
});

app.delete('/api/usuarios/:id', (req, res) => {
    const index = usuarios.findIndex(u => u.id == req.params.id);
    if (index === -1) {
        return res.status(404).json({
            mensaje: 'Usuario no encontrado'
        });
    }
    const usuarioEliminado = usuarios.splice(index, 1)[0];
    res.status(200).json({
        mensaje: 'Usuario eliminado exitosamente',
        usuario: usuarioEliminado
    });
});



//Manejo de MongoDB

// Conectar a la base de datos
conectarDB();

// Rutas
app.use('/api/usuariosDB', RutasUsuario);

// Rutas Username
app.use('/api/Username', RutasUsername);

// Ruta para Autenticacion
app.post('/api/login', ValidarLogin, (req, res) => {
    res.json({ rol: req.user.rol });
});


//Ejemplos con token 
app.post('/api/login/token', ValidarLogin, Token.envioTokenDB, (req, res) => {
    res.json({ rol: req.user.rol });
});


//Ruta para el segundo servidor, protegida con token
app.use('/images', Token.verificacionTokenDB, (req, res, next) => {
    console.log(`Usuario ${req.user.username} está accediendo a imágenes`);
    next();
}, (req, res) => {
    // Redirigir al servidor de imágenes
    res.redirect('http://localhost:3002');
});



//Ejemplos con cookie




//listener del servidor

app.listen(puerto, () => {
    console.log(`Servidor de autenticacion escuchando en el puerto http://localhost:${puerto}`);
});

