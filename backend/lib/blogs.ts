import connectDB from './mongodb'
import Blog, { IBlog } from './models/Blog'

export interface Blog {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    author: string
    category: string
    image: string
    publishedAt: string
    createdAt: string
}

export async function getBlogs(): Promise<Blog[]> {
    try {
        await connectDB()
        const blogs = await Blog.find({})
            .sort({ publishedAt: -1 })
            .lean()
        return blogs.map((b: any) => ({
            ...b,
            id: b._id ? b._id.toString() : b.id
        })) as Blog[]
    } catch (error) {
        console.error('Error reading blogs:', error)
        return []
    }
}

export async function getBlogById(id: string): Promise<Blog | null> {
    try {
        await connectDB()
        const blog = await Blog.findById(id).lean()
        if (!blog) return null
        const blogObj = blog as any
        return {
            ...blogObj,
            id: blogObj._id ? blogObj._id.toString() : blogObj.id
        } as Blog
    } catch (error) {
        console.error('Error reading blog:', error)
        return null
    }
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
    try {
        await connectDB()
        const blog = await Blog.findOne({ slug }).lean()
        if (!blog) return null
        const blogObj = blog as any
        return {
            ...blogObj,
            id: blogObj._id ? blogObj._id.toString() : blogObj.id
        } as Blog
    } catch (error) {
        console.error('Error reading blog by slug:', error)
        return null
    }
}

export async function saveBlogs(blogs: Blog[]): Promise<void> {
    try {
        await connectDB()
        await Blog.deleteMany({})
        const blogsToSave = blogs.map(b => {
            const { id, ...blogData } = b
            return blogData
        })
        await Blog.insertMany(blogsToSave)
    } catch (error) {
        console.error('Error saving blogs:', error)
        throw error
    }
}

export async function addBlog(blog: Omit<Blog, 'id' | 'createdAt'>): Promise<Blog> {
    try {
        await connectDB()
        const newBlog = new Blog({
            ...blog,
            createdAt: new Date().toISOString()
        })
        const saved = await newBlog.save()
        return {
            ...saved.toObject(),
            id: saved._id.toString()
        } as Blog
    } catch (error) {
        console.error('Error adding blog:', error)
        throw error
    }
}

export async function updateBlog(id: string, updates: Partial<Blog>): Promise<Blog | null> {
    try {
        await connectDB()
        const { id: _, ...updateData } = updates
        const blog = await Blog.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        ).lean()
        
        if (!blog) return null
        
        const blogObj = blog as any
        return {
            ...blogObj,
            id: blogObj._id ? blogObj._id.toString() : blogObj.id
        } as Blog
    } catch (error) {
        console.error('Error updating blog:', error)
        return null
    }
}

export async function deleteBlog(id: string): Promise<boolean> {
    try {
        await connectDB()
        const result = await Blog.findByIdAndDelete(id)
        return result !== null
    } catch (error) {
        console.error('Error deleting blog:', error)
        return false
    }
}

// Note: Image deletion from filesystem is handled separately if needed
export function deleteBlogImage(imagePath: string): void {
    // This function is kept for compatibility but file deletion
    // should be handled by your file storage service
    console.log('Image deletion should be handled by your file storage service:', imagePath)
}
