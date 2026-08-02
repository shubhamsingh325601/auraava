import express, { Request, Response } from 'express'
import { requireAdmin } from '../middleware/requireAdmin'
import {
    getHeroBanners,
    getActiveHeroBanners,
    getHeroBannerById,
    addHeroBanner,
    updateHeroBanner,
    deleteHeroBanner
} from '../lib/hero-banners'

const router = express.Router()

// GET /api/hero-banners - public (active only)
router.get('/', async (req: Request, res: Response) => {
    try {
        const banners = await getActiveHeroBanners()
        res.json({ banners })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hero banners' })
    }
})

// GET /api/hero-banners/all - admin (all, including inactive)
router.get('/all', requireAdmin, async (req: Request, res: Response) => {
    try {
        const banners = await getHeroBanners()
        res.json({ banners })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hero banners' })
    }
})

// GET /api/hero-banners/:id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const banner = await getHeroBannerById(req.params.id)
        if (!banner) {
            return res.status(404).json({ error: 'Hero banner not found' })
        }
        res.json({ banner })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hero banner' })
    }
})

// POST /api/hero-banners
router.post('/', requireAdmin, async (req: Request, res: Response) => {
    try {
        const newBanner = await addHeroBanner(req.body)
        res.status(201).json({ banner: newBanner })
    } catch (error) {
        res.status(500).json({ error: 'Failed to create hero banner' })
    }
})

// PUT /api/hero-banners/:id
router.put('/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const updatedBanner = await updateHeroBanner(req.params.id, req.body)
        if (!updatedBanner) {
            return res.status(404).json({ error: 'Hero banner not found' })
        }
        res.json({ banner: updatedBanner })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update hero banner' })
    }
})

// DELETE /api/hero-banners/:id
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const success = await deleteHeroBanner(req.params.id)
        if (!success) {
            return res.status(404).json({ error: 'Hero banner not found' })
        }
        res.json({ message: 'Hero banner deleted' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete hero banner' })
    }
})

export default router
