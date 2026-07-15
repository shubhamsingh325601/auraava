import connectDB from './mongodb'
import InstagramData, { IInstagramData, IInstagramPost } from './models/Instagram'

export interface InstagramPost {
    id: string
    image: string
    link?: string
    order: number
    createdAt: string
}

export interface InstagramData {
    sectionTitle: string
    sectionSubtitle: string
    posts: InstagramPost[]
}

async function getOrCreateInstagramData(): Promise<IInstagramData> {
    await connectDB()
    let data = await InstagramData.findOne().lean()
    
    if (!data) {
        const newData = new InstagramData({
            sectionTitle: 'Follow Us On Social Media',
            sectionSubtitle: 'Join The Manetain Fam',
            posts: []
        })
        const saved = await newData.save()
        data = saved.toObject() as any
    }
    
    return data as any as IInstagramData
}

export async function getInstagramData(): Promise<InstagramData> {
    try {
        const data = await getOrCreateInstagramData()
        const posts = (data.posts || []).sort((a: any, b: any) => a.order - b.order)
        return {
            sectionTitle: data.sectionTitle || 'Follow Us On Social Media',
            sectionSubtitle: data.sectionSubtitle || 'Join The Manetain Fam',
            posts: posts.map((p: any) => ({
                ...p,
                id: p._id ? p._id.toString() : p.id
            }))
        }
    } catch (error) {
        console.error('Error reading instagram data:', error)
        return {
            sectionTitle: 'Follow Us On Social Media',
            sectionSubtitle: 'Join The Manetain Fam',
            posts: []
        }
    }
}

export async function getInstagramPosts(): Promise<InstagramPost[]> {
    const data = await getInstagramData()
    return data.posts
}

export async function getInstagramPostById(id: string): Promise<InstagramPost | null> {
    try {
        const data = await getInstagramData()
        return data.posts.find(post => post.id === id) || null
    } catch (error) {
        console.error('Error reading instagram post:', error)
        return null
    }
}

export async function saveInstagramData(data: InstagramData): Promise<void> {
    try {
        await connectDB()
        await InstagramData.findOneAndUpdate(
            {},
            { $set: data },
            { upsert: true, new: true }
        )
    } catch (error) {
        console.error('Error saving instagram data:', error)
        throw error
    }
}

export async function addInstagramPost(post: Omit<InstagramPost, 'id' | 'createdAt'>): Promise<InstagramPost> {
    try {
        await connectDB()
        const data = await getOrCreateInstagramData()
        const newPost = {
            ...post,
            createdAt: new Date().toISOString()
        }
        data.posts.push(newPost as any)
        await InstagramData.findOneAndUpdate(
            {},
            { $set: { posts: data.posts } },
            { upsert: true }
        )
        return {
            ...newPost,
            id: Date.now().toString()
        } as InstagramPost
    } catch (error) {
        console.error('Error adding instagram post:', error)
        throw error
    }
}

export async function updateInstagramPost(id: string, updates: Partial<InstagramPost>): Promise<InstagramPost | null> {
    try {
        await connectDB()
        const data = await getOrCreateInstagramData()
        const postIndex = data.posts.findIndex((p: any) => 
            (p._id ? p._id.toString() : p.id) === id
        )
        
        if (postIndex === -1) return null
        
        const { id: _, ...updateData } = updates
        data.posts[postIndex] = { ...data.posts[postIndex], ...updateData } as any
        
        await InstagramData.findOneAndUpdate(
            {},
            { $set: { posts: data.posts } },
            { upsert: true }
        )
        
        return data.posts[postIndex] as InstagramPost
    } catch (error) {
        console.error('Error updating instagram post:', error)
        return null
    }
}

export async function deleteInstagramPost(id: string): Promise<boolean> {
    try {
        await connectDB()
        const data = await getOrCreateInstagramData()
        data.posts = data.posts.filter((p: any) => 
            (p._id ? p._id.toString() : p.id) !== id
        )
        await InstagramData.findOneAndUpdate(
            {},
            { $set: { posts: data.posts } },
            { upsert: true }
        )
        return true
    } catch (error) {
        console.error('Error deleting instagram post:', error)
        return false
    }
}

export async function updateInstagramSection(updates: Partial<Pick<InstagramData, 'sectionTitle' | 'sectionSubtitle'>>): Promise<InstagramData> {
    try {
        await connectDB()
        const data = await getOrCreateInstagramData()
        const updatedData = {
            ...data,
            ...updates
        }
        await InstagramData.findOneAndUpdate(
            {},
            { $set: updatedData },
            { upsert: true }
        )
        return await getInstagramData()
    } catch (error) {
        console.error('Error updating instagram section:', error)
        throw error
    }
}

// Note: Image deletion from filesystem is handled separately if needed
export function deleteInstagramImage(imagePath: string): void {
    // This function is kept for compatibility but file deletion
    // should be handled by your file storage service
    console.log('Image deletion should be handled by your file storage service:', imagePath)
}
