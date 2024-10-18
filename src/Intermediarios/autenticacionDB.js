const Usuario = require('../Modelos/modeloMDB');
const bcrypt = require('bcrypt');

const autenticarDB = async (req, res, next) => {
    const { username, password } = req.body;
    console.log(req.body);
    console.log('Usuario:', username);
    console.log('Password:', password);

    try {
        // Búsqueda del usuario en la base de datos
        const usuario = await Usuario.findOne({ username });
        console.log("Rol de bd: "+ usuario);
        if (!usuario) {
            return res.status(404).json({ message: `Usuario ${username} no encontrado` });
        }

        // Comparar la contraseña proporcionada con el hash almacenado
        const match = await bcrypt.compare(password, usuario.password);
        console.log(match);
        if (!match) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }       
                    
        rol=usuario.rol;        
        req.user = {username,rol};
        console.log(req.user);
        next();
    } catch (error) {
        console.error('Error en la autenticación:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


module.exports = autenticarDB;