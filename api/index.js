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
  const isHealth = req.method === 'GET' && (path === '/' || path === '/api')
  if (!isHealth) {
    await connect()
  }
  const handler = serverless(app)
  return handler(req, res)
}