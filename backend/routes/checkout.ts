import express, { Request, Response } from 'express'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import { initRazorpayCheckout, OrderNotFoundError, OrderNotPendingError } from '../lib/checkout'
import { isRazorpayConfigured, RazorpayNotConfiguredError } from '../lib/razorpay'

const router = express.Router()

const checkoutLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { error: 'Too many checkout attempts. Try again later.' },
    standardHeaders: true,
    legacyHeaders: false
})

// GET /api/checkout/razorpay/config — lets the frontend know upfront whether
// online payment is available, so it can show a friendly message instead of
// letting the customer hit a failure after filling out the checkout form.
router.get('/razorpay/config', (req: Request, res: Response) => {
    res.json({ configured: isRazorpayConfigured() })
})

// POST /api/checkout/razorpay/init — create a Razorpay Order for an existing,
// pending Order and return only what the client needs to open Checkout.js.
router.post('/razorpay/init', checkoutLimiter, async (req: Request, res: Response) => {
    const { orderId } = req.body as { orderId?: string }

    if (!orderId || !mongoose.isValidObjectId(orderId)) {
        return res.status(400).json({ error: 'A valid orderId is required' })
    }

    try {
        const result = await initRazorpayCheckout(orderId)
        res.json(result)
    } catch (error) {
        if (error instanceof OrderNotFoundError) {
            return res.status(404).json({ error: error.message })
        }
        if (error instanceof OrderNotPendingError) {
            return res.status(409).json({ error: error.message })
        }
        if (error instanceof RazorpayNotConfiguredError) {
            return res.status(503).json({ error: 'Online payment is temporarily unavailable. Please try again later or contact support.' })
        }
        console.error('Error initializing Razorpay checkout:', error)
        res.status(500).json({ error: 'Failed to initialize payment' })
    }
})

export default router
