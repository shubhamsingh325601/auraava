import express, { Request, Response } from 'express'
import { requireAdmin } from '../middleware/requireAdmin'
import { getSettings, saveSettings } from '../lib/settings'

const router = express.Router()

// GET /api/settings
router.get('/', async (req: Request, res: Response) => {
    try {
        const settings = await getSettings()
        res.json(settings)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch settings' })
    }
})

// POST /api/settings
router.post('/', requireAdmin, async (req: Request, res: Response) => {
    try {
        const body = req.body
        const settings = {
            whatsappPhoneNumber: body.whatsappPhoneNumber || '918971690503',
            whatsappMessageTemplate: body.whatsappMessageTemplate || "Hi! I'm interested in {productName} - Rs. {price}. Can you provide more details?"
        }
        await saveSettings(settings)
        res.json(settings)
    } catch (error) {
        res.status(500).json({ error: 'Failed to update settings' })
    }
})

export default router


