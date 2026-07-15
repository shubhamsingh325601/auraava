// Load environment variables FIRST, before any other imports
import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import connectDB from './lib/mongodb'

// Import routes
import productsRoutes from './routes/products'
import blogsRoutes from './routes/blogs'
import faqsRoutes from './routes/faqs'
import testimonialsRoutes from './routes/testimonials'
import statsRoutes from './routes/stats'
import aboutUsRoutes from './routes/about-us'
import offersRoutes from './routes/offers'
import instagramRoutes from './routes/instagram'
import skincareRoutes from './routes/skincare'
import settingsRoutes from './routes/settings'
import uploadRoutes from './routes/upload'
import authRoutes from './routes/auth'
import ordersRoutes from './routes/orders'
import adminOrdersRoutes from './routes/admin-orders'
import checkoutRoutes from './routes/checkout'
import webhooksRoutes from './routes/webhooks'

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        const allowed = [
            'http://localhost:3000',
            'http://localhost:5000',
            process.env.FRONTEND_URL,
        ].filter(Boolean)
        if (!origin || allowed.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}))
app.use(cookieParser())

// Serve uploaded images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

// Webhook routes need the raw request body to verify the Razorpay signature,
// so they're mounted with express.raw() before the global express.json()
// parser would otherwise consume and reshape the body.
app.use('/api/webhooks', express.raw({ type: '*/*' }), webhooksRoutes)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/products', productsRoutes)
app.use('/api/blogs', blogsRoutes)
app.use('/api/faqs', faqsRoutes)
app.use('/api/testimonials', testimonialsRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/about-us', aboutUsRoutes)
app.use('/api/offers', offersRoutes)
app.use('/api/instagram', instagramRoutes)
app.use('/api/skincare', skincareRoutes)
app.use('/api/hair-care', skincareRoutes) // Alias for hair-care
app.use('/api/settings', settingsRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/admin/orders', adminOrdersRoutes)
app.use('/api/checkout', checkoutRoutes)
// Note: /api/webhooks/razorpay is mounted above, before express.json()

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' })
})

// JSON error handler (catches multer errors like the upload MIME-type rejection,
// and any other error passed to next() by route handlers)
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err)
    res.status(400).json({ error: err.message || 'An unexpected error occurred' })
})

// Connect to MongoDB, then start the server. Requests must not be served
// before the DB connection is ready (mongoose bufferCommands is disabled).
connectDB()
    .then(() => {
        console.log('✅ MongoDB connected')
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`)
            console.log(`📡 API available at http://localhost:${PORT}/api`)
        })
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error)
        process.exit(1)
    })

export default app

