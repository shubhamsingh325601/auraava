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
        const current = await getSettings()
        const settings = {
            whatsappNumber: body.whatsappNumber ?? current.whatsappNumber,
            contactPhone: body.contactPhone ?? current.contactPhone,
            whatsappPhoneNumber: body.whatsappPhoneNumber ?? current.whatsappPhoneNumber,
            whatsappMessageTemplate: body.whatsappMessageTemplate ?? current.whatsappMessageTemplate,
        }
        await saveSettings(settings)
        res.json(settings)
    } catch (error) {
        res.status(500).json({ error: 'Failed to update settings' })
    }
})

export default router


