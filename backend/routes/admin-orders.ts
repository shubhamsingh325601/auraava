import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import { requireAdmin } from '../middleware/requireAdmin'
import { getOrders, getOrderById, updateOrderStatus } from '../lib/orders'
import { ORDER_STATUSES, OrderStatus } from '../lib/models/Order'

const router = express.Router()

// GET /api/admin/orders — list all orders, optional ?status= and ?search= filters
router.get('/', requireAdmin, async (req: Request, res: Response) => {
    try {
        const status = typeof req.query.status === 'string' ? req.query.status : undefined
        const search = typeof req.query.search === 'string' ? req.query.search : undefined
        const orders = await getOrders({ status, search })
        res.json({ orders })
    } catch (error) {
        console.error('Error fetching orders:', error)
        res.status(500).json({ error: 'Failed to fetch orders' })
    }
})

// GET /api/admin/orders/:id — order detail
router.get('/:id', requireAdmin, async (req: Request, res: Response) => {
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

// PATCH /api/admin/orders/:id/status — update fulfillment status only
router.patch('/:id/status', requireAdmin, async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: 'Invalid order id' })
    }

    const { status } = req.body as { status?: OrderStatus }
    if (!status || !ORDER_STATUSES.includes(status)) {
        return res.status(400).json({ error: `status must be one of: ${ORDER_STATUSES.join(', ')}` })
    }

    try {
        const order = await updateOrderStatus(req.params.id, status)
        if (!order) {
            return res.status(404).json({ error: 'Order not found' })
        }
        res.json({ order })
    } catch (error) {
        console.error('Error updating order status:', error)
        res.status(500).json({ error: 'Failed to update order status' })
    }
})

export default router
