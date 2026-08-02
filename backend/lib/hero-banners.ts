import connectDB from './mongodb'
import HeroBanner, { IHeroBanner } from './models/HeroBanner'

export interface HeroBannerData {
    id: string
    image: string
    link: string
    order: number
    active: boolean
    createdAt: string
}

export async function getHeroBanners(): Promise<HeroBannerData[]> {
    try {
        await connectDB()
        const banners = await HeroBanner.find({}).sort({ order: 1 }).lean()
        return banners.map((b: any) => ({
            ...b,
            id: b._id ? b._id.toString() : b.id
        })) as HeroBannerData[]
    } catch (error) {
        console.error('Error reading hero banners:', error)
        return []
    }
}

export async function getActiveHeroBanners(): Promise<HeroBannerData[]> {
    try {
        await connectDB()
        const banners = await HeroBanner.find({ active: true }).sort({ order: 1 }).lean()
        return banners.map((b: any) => ({
            ...b,
            id: b._id ? b._id.toString() : b.id
        })) as HeroBannerData[]
    } catch (error) {
        console.error('Error reading active hero banners:', error)
        return []
    }
}

export async function getHeroBannerById(id: string): Promise<HeroBannerData | null> {
    try {
        await connectDB()
        const banner = await HeroBanner.findById(id).lean()
        if (!banner) return null
        const b = banner as any
        return { ...b, id: b._id ? b._id.toString() : b.id } as HeroBannerData
    } catch (error) {
        console.error('Error reading hero banner:', error)
        return null
    }
}

export async function addHeroBanner(banner: Omit<HeroBannerData, 'id' | 'createdAt'>): Promise<HeroBannerData> {
    try {
        await connectDB()
        const newBanner = new HeroBanner({
            ...banner,
            createdAt: new Date().toISOString()
        })
        const saved = await newBanner.save()
        return { ...saved.toObject(), id: saved._id.toString() } as HeroBannerData
    } catch (error) {
        console.error('Error adding hero banner:', error)
        throw error
    }
}

export async function updateHeroBanner(id: string, updates: Partial<HeroBannerData>): Promise<HeroBannerData | null> {
    try {
        await connectDB()
        const { id: _, createdAt, ...updateData } = updates
        const banner = await HeroBanner.findByIdAndUpdate(id, { $set: updateData }, { new: true }).lean()
        if (!banner) return null
        const b = banner as any
        return { ...b, id: b._id ? b._id.toString() : b.id } as HeroBannerData
    } catch (error) {
        console.error('Error updating hero banner:', error)
        return null
    }
}

export async function deleteHeroBanner(id: string): Promise<boolean> {
    try {
        await connectDB()
        const result = await HeroBanner.findByIdAndDelete(id)
        return result !== null
    } catch (error) {
        console.error('Error deleting hero banner:', error)
        return false
    }
}
