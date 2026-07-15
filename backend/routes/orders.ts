import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import { createOrder, getOrderById, ProductNotFoundError } from '../lib/orders'
import { validateCreateOrderInput } from '../lib/order-validation'

const router = express.Router()

// POST /api/orders — create an order from cart + checkout details (guest, no auth)
router.post('/', async (req: Request, res: Response) => {
    const validation = validateCreateOrderInput(req.body)
    if (!validation.valid) {
        return res.status(400).json({ error: 'Invalid order data', details: validation.errors })
    }

    try {
        const order = await createOrder(validation.data)
        res.status(201).json({ order })
    } catch (error) {
        if (error instanceof ProductNotFoundError) {
            return res.status(400).json({ error: error.message })
        }
        console.error('Error creating order:', error)
        res.status(500).json({ error: 'Failed to create order' })
    }
})

// GET /api/orders/:id — order status lookup (customer-facing, e.g. Thank You page)
router.get('/:id', async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: 'Invalid order id' })
    }

    try {
        const order = await getOrderById(req.params.id)
        if (!order) {
            return res.status(404).json({ error: 'Order not found' })
        }
        res.json({ order })
    } catch (error) {
        console.error('Error fetching order:', error)
        res.status(500).json({ error: 'Failed to fetch order' })
    }
})

export default router
