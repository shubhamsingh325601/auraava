import express, { Request, Response } from 'express'
import { requireAdmin } from '../middleware/requireAdmin'
import { getStatsData, saveStatsData, updateStatItem, addStatItem } from '../lib/stats'

const router = express.Router()

// GET /api/stats
router.get('/', async (req: Request, res: Response) => {
    try {
        const data = await getStatsData()
        res.json({ ...data })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats data' })
    }
})

// POST /api/stats
router.post('/', requireAdmin, async (req: Request, res: Response) => {
    try {
        const body = req.body

        // If updating entire data structure
        if (body.items && Array.isArray(body.items)) {
            await saveStatsData({ items: body.items })
            return res.json({ items: body.items })
        }

        // If adding a new item
        if (body.label && body.number && body.order !== undefined) {
            const newItem = await addStatItem({
                label: body.label,
                number: body.number,
                order: body.order
            })
            return res.status(201).json({ item: newItem })
        }

        // If updating an existing item
        if (body.id && body.update) {
            const updatedItem = await updateStatItem(body.id, body.update)
            if (!updatedItem) {
                return res.status(404).json({ error: 'Stat item not found' })
            }
            return res.json({ item: updatedItem })
        }

        res.status(400).json({ error: 'Invalid request' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update stats data' })
    }
})

export default router


