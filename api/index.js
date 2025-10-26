const serverless = require('serverless-http')
const mongoose = require('mongoose')
const createApp = require('../src/app')

let connPromise
async function connect() {
  if (!connPromise) {
    const uri = process.env.MONGODB_URI
    if (uri && mongoose.connection.readyState === 0) {
      connPromise = mongoose.connect(uri)
    } else {
      connPromise = Promise.resolve()
    }
  }
  return connPromise
}

const app = createApp()

module.exports = async (req, res) => {
  const path = (req.url || '').split('?')[0]
  const method = (req.method || 'GET').toUpperCase()
  const isHealthPath = path === '/' || path === '/api' || path === '/api/' || path === '/favicon.ico'
  const isHealthMethod = method === 'GET' || method === 'HEAD'
  const isHealth = isHealthPath && isHealthMethod
  if (!isHealth) {
    await connect()
  }
  const handler = serverless(app)
  return handler(req, res)
}