import express, { Request, Response } from 'express'
import { requireAdmin } from '../middleware/requireAdmin'
import { getSkincareData, addSkincareItem, updateSkincareSection, getSkincareItemById, updateSkincareItem, deleteSkincareItem } from '../lib/skincare'

const router = express.Router()

// GET /api/skincare or /api/hair-care
router.get('/', async (req: Request, res: Response) => {
    try {
        const data = await getSkincareData()
        res.json({ ...data })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hair care data' })
    }
})

// GET /api/skincare/:id or /api/hair-care/:id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const item = await getSkincareItemById(req.params.id)
        if (!item) {
            return res.status(404).json({ error: 'Hair care item not found' })
        }
        res.json({ item })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hair care item' })
    }
})

// POST /api/skincare or /api/hair-care
router.post('/', requireAdmin, async (req: Request, res: Response) => {
    try {
        const body = req.body

        // Check if updating section metadata
        if (body.sectionTitle !== undefined || body.sectionDescription !== undefined) {
            const updated = await updateSkincareSection({
                sectionTitle: body.sectionTitle,
                sectionDescription: body.sectionDescription
            })
            return res.json({ ...updated })
        }

        // Otherwise, add a new item
        const newItem = await addSkincareItem(body)
        return res.status(201).json({ item: newItem })
    } catch (error) {
        res.status(500).json({ error: 'Failed to create hair care item' })
    }
})

// PUT /api/skincare/:id or /api/hair-care/:id
router.put('/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const updatedItem = await updateSkincareItem(req.params.id, req.body)
        if (!updatedItem) {
            return res.status(404).json({ error: 'Hair care item not found' })
        }
        res.json({ item: updatedItem })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update hair care item' })
    }
})

// DELETE /api/skincare/:id or /api/hair-care/:id
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const success = await deleteSkincareItem(req.params.id)
        if (!success) {
            return res.status(404).json({ error: 'Hair care item not found' })
        }
        res.json({ message: 'Hair care item deleted' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete hair care item' })
    }
})

export default router


