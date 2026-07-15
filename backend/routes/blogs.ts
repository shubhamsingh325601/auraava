import express, { Request, Response } from 'express'
import { requireAdmin } from '../middleware/requireAdmin'
import { getBlogs, addBlog, getBlogById, updateBlog, deleteBlog, getBlogBySlug } from '../lib/blogs'

const router = express.Router()

// GET /api/blogs
router.get('/', async (req: Request, res: Response) => {
    try {
        const blogs = await getBlogs()
        res.json({ blogs })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch blogs' })
    }
})

// GET /api/blogs/slug/:slug
router.get('/slug/:slug', async (req: Request, res: Response) => {
    try {
        const blog = await getBlogBySlug(req.params.slug)
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' })
        }
        res.json({ blog })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch blog' })
    }
})

// GET /api/blogs/:id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const blog = await getBlogById(req.params.id)
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' })
        }
        res.json({ blog })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch blog' })
    }
})

// POST /api/blogs
router.post('/', requireAdmin, async (req: Request, res: Response) => {
    try {
        const newBlog = await addBlog(req.body)
        res.status(201).json({ blog: newBlog })
    } catch (error) {
        res.status(500).json({ error: 'Failed to create blog' })
    }
})

// PUT /api/blogs/:id
router.put('/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const updatedBlog = await updateBlog(req.params.id, req.body)
        if (!updatedBlog) {
            return res.status(404).json({ error: 'Blog not found' })
        }
        res.json({ blog: updatedBlog })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update blog' })
    }
})

// DELETE /api/blogs/:id
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const success = await deleteBlog(req.params.id)
        if (!success) {
            return res.status(404).json({ error: 'Blog not found' })
        }
        res.json({ message: 'Blog deleted' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete blog' })
    }
})

export default router


