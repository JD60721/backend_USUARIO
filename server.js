require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const authRoutes = require('./src/routes/auth')
const productRoutes = require('./src/routes/products')

const app = express()
const PORT = process.env.PORT || 5000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
const MONGODB_URI = process.env.MONGODB_URI

app.use(cors({ origin: CLIENT_URL, credentials: false }))
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'API MERN activo' })
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

async function start() {
  try {
    if (!MONGODB_URI) {
      console.warn('MONGODB_URI no está definido. Configura tu .env con la URI de MongoDB Atlas.')
    } else {
      await mongoose.connect(MONGODB_URI)
      console.log('Conectado a MongoDB Atlas')
    }

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Error al iniciar el servidor:', err)
    process.exit(1)
  }
}

start()