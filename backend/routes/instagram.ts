import express, { Request, Response } from 'express'
import { requireAdmin } from '../middleware/requireAdmin'
import { getInstagramData, addInstagramPost, updateInstagramSection, getInstagramPostById, updateInstagramPost, deleteInstagramPost } from '../lib/instagram'

const router = express.Router()

// GET /api/instagram
router.get('/', async (req: Request, res: Response) => {
    try {
        const data = await getInstagramData()
        res.json({ ...data })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch instagram data' })
    }
})

// GET /api/instagram/:id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const post = await getInstagramPostById(req.params.id)
        if (!post) {
            return res.status(404).json({ error: 'Instagram post not found' })
        }
        res.json({ post })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch instagram post' })
    }
})

// POST /api/instagram
router.post('/', requireAdmin, async (req: Request, res: Response) => {
    try {
        const body = req.body

        // Check if updating section metadata
        if (body.sectionTitle !== undefined || body.sectionSubtitle !== undefined) {
            const updated = await updateInstagramSection({
                sectionTitle: body.sectionTitle,
                sectionSubtitle: body.sectionSubtitle
            })
            return res.json({ ...updated })
        }

        // Otherwise, add a new post
        const newPost = await addInstagramPost(body)
        return res.status(201).json({ post: newPost })
    } catch (error) {
        res.status(500).json({ error: 'Failed to create instagram post' })
    }
})

// PUT /api/instagram/:id
router.put('/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const updatedPost = await updateInstagramPost(req.params.id, req.body)
        if (!updatedPost) {
            return res.status(404).json({ error: 'Instagram post not found' })
        }
        res.json({ post: updatedPost })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update instagram post' })
    }
})

// DELETE /api/instagram/:id
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const success = await deleteInstagramPost(req.params.id)
        if (!success) {
            return res.status(404).json({ error: 'Instagram post not found' })
        }
        res.json({ message: 'Instagram post deleted' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete instagram post' })
    }
})

export default router


