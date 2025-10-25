const jwt = require('jsonwebtoken')

module.exports = function auth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return res.status(401).json({ message: 'No autorizado: token ausente' })
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret')
    req.user = { id: payload.sub, email: payload.email, name: payload.name }
    next()
  } catch (err) {
    return res.status(401).json({ message: 'No autorizado: token inválido' })
  }
}