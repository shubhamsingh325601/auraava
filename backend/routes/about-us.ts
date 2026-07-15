import express, { Request, Response } from 'express'
import { requireAdmin } from '../middleware/requireAdmin'
import { getAboutUsData, updateAboutUsSection, addAboutUsSection, getAboutUsSectionById, deleteAboutUsSection } from '../lib/about-us'

const router = express.Router()

// GET /api/about-us
router.get('/', async (req: Request, res: Response) => {
    try {
        const data = await getAboutUsData()
        res.json({ ...data })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch about-us data' })
    }
})

// GET /api/about-us/:id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const section = await getAboutUsSectionById(req.params.id)
        if (!section) {
            return res.status(404).json({ error: 'Section not found' })
        }
        res.json({ section })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch section' })
    }
})

// POST /api/about-us
router.post('/', requireAdmin, async (req: Request, res: Response) => {
    try {
        const body = req.body

        // Check if adding a new section
        if (body.action === 'add' && body.section) {
            const newSection = await addAboutUsSection(body.section)
            return res.status(201).json({ section: newSection })
        }

        // Otherwise, update an existing section
        if (body.id && body.update) {
            const updated = await updateAboutUsSection(body.id, body.update)
            if (!updated) {
                return res.status(404).json({ error: 'Section not found' })
            }
            return res.json({ section: updated })
        }

        res.status(400).json({ error: 'Invalid request' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update about-us' })
    }
})

// PUT /api/about-us/:id
router.put('/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const updatedSection = await updateAboutUsSection(req.params.id, req.body)
        if (!updatedSection) {
            return res.status(404).json({ error: 'Section not found' })
        }
        res.json({ section: updatedSection })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update section' })
    }
})

// DELETE /api/about-us/:id
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const success = await deleteAboutUsSection(req.params.id)
        if (!success) {
            return res.status(404).json({ error: 'Section not found' })
        }
        res.json({ message: 'Section deleted' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete section' })
    }
})

export default router


