import express, { Request, Response } from 'express'
import { requireAdmin } from '../middleware/requireAdmin'
import { getProducts, addProduct, getProductById, updateProduct, deleteProduct, getBestSellerProducts } from '../lib/products'

const router = express.Router()

// GET /api/products
router.get('/', async (req: Request, res: Response) => {
    try {
        const products = await getProducts()
        res.json({ products })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' })
    }
})

// GET /api/products/best-sellers
router.get('/best-sellers', async (req: Request, res: Response) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 6
        const products = await getBestSellerProducts(limit)
        res.json({ products })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch best sellers' })
    }
})

// GET /api/products/:id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const product = await getProductById(req.params.id)
        if (!product) {
            return res.status(404).json({ error: 'Product not found' })
        }
        res.json({ product })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' })
    }
})

// POST /api/products
router.post('/', requireAdmin, async (req: Request, res: Response) => {
    try {
        const newProduct = await addProduct(req.body)
        res.status(201).json({ product: newProduct })
    } catch (error) {
        console.error('Error creating product:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        res.status(500).json({
            error: 'Failed to create product',
            details: errorMessage
        })
    }
})

// PUT /api/products/:id
router.put('/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const updatedProduct = await updateProduct(req.params.id, req.body)
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' })
        }
        res.json({ product: updatedProduct })
    } catch (error) {
        console.error('Error updating product:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        res.status(500).json({
            error: 'Failed to update product',
            details: errorMessage
        })
    }
})

// DELETE /api/products/:id
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const success = await deleteProduct(req.params.id)
        if (!success) {
            return res.status(404).json({ error: 'Product not found' })
        }
        res.json({ message: 'Product deleted' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' })
    }
})

export default router


