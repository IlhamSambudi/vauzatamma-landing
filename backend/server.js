require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const apiRoutes = require('./routes/api')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// API Routes
app.use('/api', apiRoutes)

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'vauzatamma-backend' })
})

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message)
    res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' })
})

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🕌 Vauza Tamma Backend running on port ${PORT}`)
    console.log(`📦 API: http://localhost:${PORT}/api`)
    console.log(`✅ Health: http://localhost:${PORT}/health`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`)
})

module.exports = app
