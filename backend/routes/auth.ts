import express, { Request, Response } from 'express'
import rateLimit from 'express-rate-limit'
import { createToken, verifyToken, validateCredentials } from '../lib/auth'

const router = express.Router()

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { error: 'Too many login attempts. Try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
})

// POST /api/auth/login
router.post('/login', loginLimiter, async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' })
        }

        if (!validateCredentials(username, password)) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const token = await createToken(username)

        res.cookie('admin-session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 1000, // 24 hours in milliseconds
            path: '/',
        })

        res.json({ success: true, message: 'Login successful', token })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ error: 'An error occurred during login' })
    }
})

// GET /api/auth/check
router.get('/check', async (req: Request, res: Response) => {
    try {
        const token = req.cookies['admin-session'] || req.headers.authorization?.replace('Bearer ', '')

        if (!token) {
            return res.status(401).json({ authenticated: false })
        }

        const session = await verifyToken(token)

        if (!session) {
            return res.status(401).json({ authenticated: false })
        }

        res.json({
            authenticated: true,
            username: session.username
        })
    } catch (error) {
        console.error('Auth check error:', error)
        res.status(401).json({ authenticated: false })
    }
})

// POST /api/auth/logout
router.post('/logout', (req: Request, res: Response) => {
    try {
        res.clearCookie('admin-session', { path: '/' })
        res.json({ success: true, message: 'Logout successful' })
    } catch (error) {
        console.error('Logout error:', error)
        res.status(500).json({ error: 'An error occurred during logout' })
    }
})

export default router
