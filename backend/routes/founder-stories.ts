import express, { Request, Response } from 'express'
import { requireAdmin } from '../middleware/requireAdmin'
import {
    getFounderStories,
    getFounderStoryById,
    addFounderStory,
    updateFounderStory,
    deleteFounderStory
} from '../lib/founder-stories'

const router = express.Router()

// GET /api/founder-stories
router.get('/', async (req: Request, res: Response) => {
    try {
        const stories = await getFounderStories()
        res.json({ stories })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch founder stories' })
    }
})

// GET /api/founder-stories/:id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const story = await getFounderStoryById(req.params.id)
        if (!story) {
            return res.status(404).json({ error: 'Founder story not found' })
        }
        res.json({ story })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch founder story' })
    }
})

// POST /api/founder-stories
router.post('/', requireAdmin, async (req: Request, res: Response) => {
    try {
        const newStory = await addFounderStory(req.body)
        res.status(201).json({ story: newStory })
    } catch (error) {
        res.status(500).json({ error: 'Failed to create founder story' })
    }
})

// PUT /api/founder-stories/:id
router.put('/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const updatedStory = await updateFounderStory(req.params.id, req.body)
        if (!updatedStory) {
            return res.status(404).json({ error: 'Founder story not found' })
        }
        res.json({ story: updatedStory })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update founder story' })
    }
})

// DELETE /api/founder-stories/:id
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const success = await deleteFounderStory(req.params.id)
        if (!success) {
            return res.status(404).json({ error: 'Founder story not found' })
        }
        res.json({ message: 'Founder story deleted' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete founder story' })
    }
})

export default router
