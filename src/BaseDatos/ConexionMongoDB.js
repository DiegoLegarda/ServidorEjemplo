const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conexión a MongoDB exitosa');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', err);
} 
};

module.exports = conectarDB;