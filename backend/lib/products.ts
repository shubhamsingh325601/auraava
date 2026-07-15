import connectDB from './mongodb'
import Product, { IProduct } from './models/Product'

export interface Product {
    id: string
    name: string
    category: string
    shortDescription: string
    fullDescription: string
    price: number
    currency: string
    images: string[]
    mainImage: string
    rating: number
    reviews: number
    inStock: boolean
    sizes: string[]
    keyBenefits?: { label: string; icon: string }[]
    bestSeller?: boolean
    buttonText?: string
    buttonLink?: string
    whatsappPhoneNumber?: string
    whatsappMessageTemplate?: string
    directCheckoutEnabled?: boolean
    createdAt: string
}

export async function getProducts(): Promise<Product[]> {
    try {
        await connectDB()
        const products = await Product.find({}).lean()
        return products.map((p: any) => ({
            ...p,
            id: p._id ? p._id.toString() : p.id
        })) as Product[]
    } catch (error) {
        console.error('Error reading products:', error)
        return []
    }
}

export async function getBestSellerProducts(limit = 6): Promise<Product[]> {
    try {
        await connectDB()
        const products = await Product.find({ bestSeller: true }).limit(limit).lean()
        return products.map((p: any) => ({
            ...p,
            id: p._id ? p._id.toString() : p.id
        })) as Product[]
    } catch (error) {
        console.error('Error reading best seller products:', error)
        return []
    }
}

export async function getProductById(id: string): Promise<Product | null> {
    try {
        await connectDB()
        const product = await Product.findById(id).lean()
        if (!product) return null
        const productObj = product as any
        return {
            ...productObj,
            id: productObj._id ? productObj._id.toString() : productObj.id
        } as Product
    } catch (error) {
        console.error('Error reading product:', error)
        return null
    }
}

export async function saveProducts(products: Product[]): Promise<void> {
    try {
        await connectDB()
        // Delete all existing products
        await Product.deleteMany({})
        // Insert new products
        const productsToSave = products.map(p => {
            const { id, ...productData } = p
            return productData
        })
        await Product.insertMany(productsToSave)
    } catch (error) {
        console.error('Error saving products:', error)
        throw new Error(`Failed to save products: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

export async function addProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    try {
        await connectDB()
        const newProduct = new Product({
            ...product,
            createdAt: new Date().toISOString()
        })
        const saved = await newProduct.save()
        return {
            ...saved.toObject(),
            id: saved._id.toString()
        } as Product
    } catch (error) {
        console.error('Error adding product:', error)
        throw error
    }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
        await connectDB()
        const { id: _, ...updateData } = updates
        const product = await Product.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        ).lean()
        
        if (!product) return null
        
        const productObj = product as any
        return {
            ...productObj,
            id: productObj._id ? productObj._id.toString() : productObj.id
        } as Product
    } catch (error) {
        console.error('Error updating product:', error)
        return null
    }
}

export async function deleteProduct(id: string): Promise<boolean> {
    try {
        await connectDB()
        const result = await Product.findByIdAndDelete(id)
        return result !== null
    } catch (error) {
        console.error('Error deleting product:', error)
        return false
    }
}

// Note: Image deletion from filesystem is handled separately if needed
export function deleteProductImages(imagePaths: string[]): void {
    // This function is kept for compatibility but file deletion
    // should be handled by your file storage service (e.g., Cloudinary, S3)
    console.log('Image deletion should be handled by your file storage service:', imagePaths)
}
