const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String },
  quantity: { type: Number, default: 1, min: 1 },
}, { _id: false })

const InventorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [ItemSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Inventory', InventorySchema)