const express = require('express');
const cors = require('cors');

// Importa tus rutas existentes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

function createApp() {
  const app = express();

  const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

  app.use(cors({ origin: CLIENT_URL, credentials: false }));
  app.use(express.json());

  // Monta rutas bajo /api para mantener compatibilidad
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);

  app.get('/api', (req, res) => {
    res.json({ ok: true, service: 'backend', base: '/api', timestamp: Date.now() })
  });

  return app;
}

module.exports = createApp;