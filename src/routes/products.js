const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Inventory = require('../models/Inventory')

// Guarda selección de productos como inventario del usuario
router.post('/selection', auth, async (req, res) => {
  try {
    const { items } = req.body
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'items debe ser un arreglo no vacío' })
    }

    // Normaliza cantidad por productoId
    const normalized = []
    const map = new Map()
    for (const it of items) {
      const pid = it.productId || it.id || it._id || it
      if (!pid) continue
      const name = it.name || it.title || undefined
      const prev = map.get(pid) || { productId: pid, name, quantity: 0 }
      prev.quantity += it.quantity ? Number(it.quantity) || 1 : 1
      prev.name = prev.name || name
      map.set(pid, prev)
    }
    for (const v of map.values()) normalized.push(v)

    const doc = new Inventory({ user: req.user.id, items: normalized })
    await doc.save()
    return res.status(201).json({ message: 'Inventario guardado', inventoryId: doc._id })
  } catch (err) {
    console.error('Error guardando inventario:', err)
    return res.status(500).json({ message: 'Error del servidor' })
  }
})

// Lista inventarios del usuario autenticado
router.get('/', auth, async (req, res) => {
  try {
    const docs = await Inventory.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(docs)
  } catch (err) {
    res.status(500).json({ message: 'Error del servidor' })
  }
})

module.exports = router