import express, { Request, Response } from 'express'
import multer, { FileFilterCallback } from 'multer'
import path from 'path'
import { promises as fs } from 'fs'
import { requireAdmin } from '../middleware/requireAdmin'

const router = express.Router()

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif'])

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'uploads')
        try {
            await fs.mkdir(uploadDir, { recursive: true })
            cb(null, uploadDir)
        } catch (error) {
            cb(error as Error, uploadDir)
        }
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now()
        const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')
        cb(null, `${timestamp}-${sanitizedFilename}`)
    }
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (!ALLOWED_MIME_TYPES.has(file.mimetype) || !ALLOWED_EXTENSIONS.has(ext)) {
        return cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed'))
    }
    cb(null, true)
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter
})

// POST /api/upload
router.post('/', requireAdmin, upload.single('file'), (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' })
        }

        const url = `/uploads/${req.file.filename}`
        res.json({ url })
    } catch (error) {
        console.error('Upload error:', error)
        res.status(500).json({ error: 'Failed to upload file' })
    }
})

export default router


