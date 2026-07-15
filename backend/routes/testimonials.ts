import express, { Request, Response } from 'express'
import { requireAdmin } from '../middleware/requireAdmin'
import { getTestimonials, addTestimonial, getTestimonialById, updateTestimonial, deleteTestimonial } from '../lib/testimonials'

const router = express.Router()

// GET /api/testimonials
router.get('/', async (req: Request, res: Response) => {
    try {
        const testimonials = await getTestimonials()
        res.json({ testimonials })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch testimonials' })
    }
})

// GET /api/testimonials/:id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const testimonial = await getTestimonialById(req.params.id)
        if (!testimonial) {
            return res.status(404).json({ error: 'Testimonial not found' })
        }
        res.json({ testimonial })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch testimonial' })
    }
})

// POST /api/testimonials
router.post('/', requireAdmin, async (req: Request, res: Response) => {
    try {
        const newTestimonial = await addTestimonial(req.body)
        res.status(201).json({ testimonial: newTestimonial })
    } catch (error) {
        res.status(500).json({ error: 'Failed to create testimonial' })
    }
})

// PUT /api/testimonials/:id
router.put('/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const updatedTestimonial = await updateTestimonial(req.params.id, req.body)
        if (!updatedTestimonial) {
            return res.status(404).json({ error: 'Testimonial not found' })
        }
        res.json({ testimonial: updatedTestimonial })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update testimonial' })
    }
})

// DELETE /api/testimonials/:id
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const success = await deleteTestimonial(req.params.id)
        if (!success) {
            return res.status(404).json({ error: 'Testimonial not found' })
        }
        res.json({ message: 'Testimonial deleted' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete testimonial' })
    }
})

export default router


