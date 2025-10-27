const express = require('express');
const cors = require('cors');

// Importa tus rutas existentes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

function createApp() {
  const app = express();

  const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
  const CORS_ORIGINS = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const ALLOW_VERCEL_PREVIEWS = (process.env.ALLOW_VERCEL_PREVIEWS || 'true') === 'true';

  const originFn = (origin, callback) => {
    // Permite llamadas internas / server-to-server
    if (!origin) return callback(null, true);

    // Lista explícita de orígenes válidos
    const allowList = [CLIENT_URL, ...CORS_ORIGINS].filter(Boolean);
    const isExactAllowed = allowList.includes(origin);

    // Soporte comodines simples (ej: https://frontend-usuario*.vercel.app)
    const isWildcardAllowed = allowList.some(pat => {
      if (!pat || !pat.includes('*')) return false;
      const re = new RegExp('^' + pat.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$');
      return re.test(origin);
    });

    // Permitir previews de Vercel si está activado
    const isVercelPreview = /\.vercel\.app$/.test(origin);

    if (isExactAllowed || isWildcardAllowed || (ALLOW_VERCEL_PREVIEWS && isVercelPreview)) {
      return callback(null, true);
    }
    return callback(new Error('CORS: origin no permitido: ' + origin), false);
  };

  app.use(cors({ origin: originFn, credentials: false }));
  // Manejo explícito del preflight global
  app.options('*', cors({ origin: originFn, credentials: false }));

  app.use(express.json());

  // Monta rutas bajo /api para mantener compatibilidad
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);

  app.get('/', (req, res) => {
    res.json({ ok: true, service: 'backend', timestamp: Date.now() })
  });

  app.get('/api', (req, res) => {
    res.json({ ok: true, service: 'backend', base: '/api', timestamp: Date.now() })
  });

  app.head('/', (req, res) => {
    res.status(200).end()
  });

  app.head('/api', (req, res) => {
    res.status(200).end()
  });

  return app;
}

module.exports = createApp;