const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const routes = require('./routes') // Auto-resolves to ./routes/index.js

// Middleware to parse JSON bodies
app.use(express.json())

// Mount API routes
app.use('/api', routes)

// Root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Ecommerce API. Visit /api/health for system status.')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
