import connectDB from './mongodb'
import HairCareData, { IHairCareData, IHairCareItem } from './models/Skincare'

export interface HairCareItem {
    id: string
    title: string
    description: string
    image: string
    reverse: boolean
    order: number
    createdAt: string
}

export interface HairCareData {
    sectionTitle: string
    sectionDescription: string
    items: HairCareItem[]
}

async function getOrCreateHairCareData(): Promise<IHairCareData> {
    await connectDB()
    let data = await HairCareData.findOne().lean()
    
    if (!data) {
        const newData = new HairCareData({
            sectionTitle: 'Hair Care Essentials 🌸',
            sectionDescription: '',
            items: []
        })
        const saved = await newData.save()
        data = saved.toObject() as any
    }
    
    return data as any as IHairCareData
}

export async function getSkincareData(): Promise<HairCareData> {
    try {
        const data = await getOrCreateHairCareData()
        const items = (data.items || []).sort((a: any, b: any) => a.order - b.order)
        return {
            sectionTitle: data.sectionTitle || 'Hair Care Essentials 🌸',
            sectionDescription: data.sectionDescription || '',
            items: items.map((i: any) => ({
                ...i,
                id: i._id ? i._id.toString() : i.id
            }))
        }
    } catch (error) {
        console.error('Error reading hair care data:', error)
        return {
            sectionTitle: 'Hair Care Essentials 🌸',
            sectionDescription: '',
            items: []
        }
    }
}

export async function getSkincareItems(): Promise<HairCareItem[]> {
    const data = await getSkincareData()
    return data.items
}

export async function getSkincareItemById(id: string): Promise<HairCareItem | null> {
    try {
        const data = await getSkincareData()
        return data.items.find(item => item.id === id) || null
    } catch (error) {
        console.error('Error reading hair care item:', error)
        return null
    }
}

export async function saveSkincareData(data: HairCareData): Promise<void> {
    try {
        await connectDB()
        await HairCareData.findOneAndUpdate(
            {},
            { $set: data },
            { upsert: true, new: true }
        )
    } catch (error) {
        console.error('Error saving hair care data:', error)
        throw error
    }
}

export async function addSkincareItem(item: Omit<HairCareItem, 'id' | 'createdAt'>): Promise<HairCareItem> {
    try {
        await connectDB()
        const data = await getOrCreateHairCareData()
        const newItem = {
            ...item,
            createdAt: new Date().toISOString()
        }
        data.items.push(newItem as any)
        await HairCareData.findOneAndUpdate(
            {},
            { $set: { items: data.items } },
            { upsert: true }
        )
        return {
            ...newItem,
            id: Date.now().toString()
        } as HairCareItem
    } catch (error) {
        console.error('Error adding hair care item:', error)
        throw error
    }
}

export async function updateSkincareItem(id: string, updates: Partial<HairCareItem>): Promise<HairCareItem | null> {
    try {
        await connectDB()
        const data = await getOrCreateHairCareData()
        const itemIndex = data.items.findIndex((i: any) => 
            (i._id ? i._id.toString() : i.id) === id
        )
        
        if (itemIndex === -1) return null
        
        const { id: _, ...updateData } = updates
        data.items[itemIndex] = { ...data.items[itemIndex], ...updateData } as any
        
        await HairCareData.findOneAndUpdate(
            {},
            { $set: { items: data.items } },
            { upsert: true }
        )
        
        return data.items[itemIndex] as HairCareItem
    } catch (error) {
        console.error('Error updating hair care item:', error)
        return null
    }
}

export async function deleteSkincareItem(id: string): Promise<boolean> {
    try {
        await connectDB()
        const data = await getOrCreateHairCareData()
        data.items = data.items.filter((i: any) => 
            (i._id ? i._id.toString() : i.id) !== id
        )
        await HairCareData.findOneAndUpdate(
            {},
            { $set: { items: data.items } },
            { upsert: true }
        )
        return true
    } catch (error) {
        console.error('Error deleting hair care item:', error)
        return false
    }
}

export async function updateSkincareSection(updates: Partial<Pick<HairCareData, 'sectionTitle' | 'sectionDescription'>>): Promise<HairCareData> {
    try {
        await connectDB()
        const data = await getOrCreateHairCareData()
        const updatedData = {
            ...data,
            ...updates
        }
        await HairCareData.findOneAndUpdate(
            {},
            { $set: updatedData },
            { upsert: true }
        )
        return await getSkincareData()
    } catch (error) {
        console.error('Error updating hair care section:', error)
        throw error
    }
}

// Note: Image deletion from filesystem is handled separately if needed
export function deleteSkincareImage(imagePath: string): void {
    // This function is kept for compatibility but file deletion
    // should be handled by your file storage service
    console.log('Image deletion should be handled by your file storage service:', imagePath)
}
