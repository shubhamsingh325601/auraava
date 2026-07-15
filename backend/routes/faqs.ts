import express, { Request, Response } from 'express'
import { requireAdmin } from '../middleware/requireAdmin'
import { getFAQs, addFAQ, getFAQById, updateFAQ, deleteFAQ } from '../lib/faqs'

const router = express.Router()

// GET /api/faqs
router.get('/', async (req: Request, res: Response) => {
    try {
        const faqs = await getFAQs()
        res.json({ faqs })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch FAQs' })
    }
})

// GET /api/faqs/:id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const faq = await getFAQById(req.params.id)
        if (!faq) {
            return res.status(404).json({ error: 'FAQ not found' })
        }
        res.json({ faq })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch FAQ' })
    }
})

// POST /api/faqs
router.post('/', requireAdmin, async (req: Request, res: Response) => {
    try {
        const newFAQ = await addFAQ(req.body)
        res.status(201).json({ faq: newFAQ })
    } catch (error) {
        res.status(500).json({ error: 'Failed to create FAQ' })
    }
})

// PUT /api/faqs/:id
router.put('/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const updatedFAQ = await updateFAQ(req.params.id, req.body)
        if (!updatedFAQ) {
            return res.status(404).json({ error: 'FAQ not found' })
        }
        res.json({ faq: updatedFAQ })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update FAQ' })
    }
})

// DELETE /api/faqs/:id
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const success = await deleteFAQ(req.params.id)
        if (!success) {
            return res.status(404).json({ error: 'FAQ not found' })
        }
        res.json({ message: 'FAQ deleted' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete FAQ' })
    }
})

export default router


