require('dotenv').config();
const mongoose = require('mongoose');
const createApp = require('./src/app');

const app = createApp();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

async function start() {
  try {
    if (!MONGODB_URI) {
      console.warn('MONGODB_URI no está definido. Configura tu .env con la URI de MongoDB Atlas.');
    } else {
      await mongoose.connect(MONGODB_URI);
      console.log('Conectado a MongoDB Atlas');
    }

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error al iniciar el servidor:', err);
    process.exit(1);
  }
}

start();