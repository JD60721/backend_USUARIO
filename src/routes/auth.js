const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

function signToken(user) {
  const payload = { sub: user._id, email: user.email, name: user.name }
  const secret = process.env.JWT_SECRET || 'dev-secret'
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y password son requeridos' })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ message: 'El email ya está registrado' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash })

    const token = signToken(user)
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error al registrar usuario' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y password son requeridos' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    const token = signToken(user)
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error al iniciar sesión' })
  }
})

module.exports = router