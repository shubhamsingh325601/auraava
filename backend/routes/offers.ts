import express, { Request, Response } from 'express'
import { requireAdmin } from '../middleware/requireAdmin'
import { getOffersData, updateOfferItem, updateOffersSection, getOfferById, addOfferItem, deleteOfferItem } from '../lib/offers'

const router = express.Router()

// GET /api/offers
router.get('/', async (req: Request, res: Response) => {
    try {
        const data = await getOffersData()
        res.json({ ...data })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch offers data' })
    }
})

// GET /api/offers/:id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const offer = await getOfferById(req.params.id)
        if (!offer) {
            return res.status(404).json({ error: 'Offer item not found' })
        }
        res.json({ item: offer })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch offer item' })
    }
})

// POST /api/offers
router.post('/', requireAdmin, async (req: Request, res: Response) => {
    try {
        const body = req.body

        // Check if adding a new offer item
        if (body.action === 'add' && body.item) {
            const newItem = await addOfferItem(body.item)
            return res.status(201).json({ item: newItem })
        }

        // Check if updating section metadata or visibility
        if (body.sectionTitle !== undefined || body.sectionSubtitle !== undefined || body.isVisible !== undefined) {
            const updated = await updateOffersSection({
                sectionTitle: body.sectionTitle,
                sectionSubtitle: body.sectionSubtitle,
                isVisible: body.isVisible
            })
            return res.json({ ...updated })
        }

        res.status(400).json({ error: 'Invalid request' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to create offer' })
    }
})

// PUT /api/offers/:id
router.put('/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const updatedOffer = await updateOfferItem(req.params.id, req.body)
        if (!updatedOffer) {
            return res.status(404).json({ error: 'Offer item not found' })
        }
        res.json({ item: updatedOffer })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update offer item' })
    }
})

// DELETE /api/offers/:id
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const success = await deleteOfferItem(req.params.id)
        if (!success) {
            return res.status(404).json({ error: 'Offer item not found' })
        }
        res.json({ message: 'Offer item deleted' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete offer item' })
    }
})

export default router


