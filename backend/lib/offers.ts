import connectDB from './mongodb'
import OffersData, { IOffersData, IOfferItem } from './models/Offer'

export interface OfferItem {
    id: string
    title: string
    description: string
    image: string
    discount: string
    link: string
    order: number
}

export interface OffersData {
    sectionTitle: string
    sectionSubtitle: string
    isVisible: boolean
    offers: OfferItem[]
}

async function getOrCreateOffersData(): Promise<IOffersData> {
    await connectDB()
    let data = await OffersData.findOne().lean()
    
    if (!data) {
        const newData = new OffersData({
            sectionTitle: '✨ Mega Sale Week ✨',
            sectionSubtitle: '',
            isVisible: true,
            offers: []
        })
        const saved = await newData.save()
        data = saved.toObject() as any
    }
    
    return data as any as IOffersData
}

export async function getOffersData(): Promise<OffersData> {
    try {
        const data = await getOrCreateOffersData()
        const offers = (data.offers || []).sort((a: any, b: any) => a.order - b.order)
        return {
            sectionTitle: data.sectionTitle || '✨ Mega Sale Week ✨',
            sectionSubtitle: data.sectionSubtitle || '',
            isVisible: data.isVisible !== undefined ? data.isVisible : true,
            offers: offers.map((o: any) => ({
                ...o,
                id: o._id ? o._id.toString() : o.id
            }))
        }
    } catch (error) {
        console.error('Error reading offers:', error)
        return {
            sectionTitle: '✨ Mega Sale Week ✨',
            sectionSubtitle: '',
            isVisible: true,
            offers: []
        }
    }
}

export async function getOffers(): Promise<OfferItem[]> {
    const data = await getOffersData()
    return data.offers
}

export async function getOfferById(id: string): Promise<OfferItem | null> {
    try {
        const data = await getOffersData()
        return data.offers.find(o => o.id === id) || null
    } catch (error) {
        console.error('Error reading offer:', error)
        return null
    }
}

export async function saveOffersData(data: OffersData): Promise<void> {
    try {
        await connectDB()
        await OffersData.findOneAndUpdate(
            {},
            { $set: data },
            { upsert: true, new: true }
        )
    } catch (error) {
        console.error('Error saving offers data:', error)
        throw error
    }
}

export async function addOfferItem(item: Omit<OfferItem, 'id'>): Promise<OfferItem> {
    try {
        await connectDB()
        await getOrCreateOffersData()
        
        await OffersData.findOneAndUpdate(
            {},
            { $push: { offers: item } },
            { upsert: true }
        )
        
        const updatedData = await getOffersData()
        const addedItem = updatedData.offers.find(o => 
            o.title === item.title && 
            o.description === item.description &&
            o.discount === item.discount
        )
        
        if (!addedItem) {
            throw new Error('Failed to find newly added offer item')
        }
        
        return addedItem
    } catch (error) {
        console.error('Error adding offer item:', error)
        throw error
    }
}

export async function updateOfferItem(id: string, updates: Partial<OfferItem>): Promise<OfferItem | null> {
    try {
        await connectDB()
        const data = await getOrCreateOffersData()
        const offerIndex = data.offers.findIndex((o: any) => 
            (o._id ? o._id.toString() : o.id) === id
        )
        
        if (offerIndex === -1) return null
        
        const originalItem = data.offers[offerIndex] as any
        const originalId = originalItem._id ? originalItem._id.toString() : originalItem.id
        
        const { id: _, ...updateData } = updates
        data.offers[offerIndex] = { ...data.offers[offerIndex], ...updateData } as any
        
        await OffersData.findOneAndUpdate(
            {},
            { $set: { offers: data.offers } },
            { upsert: true }
        )
        
        const updatedData = await getOffersData()
        return updatedData.offers.find(o => o.id === originalId || o.id === id) || null
    } catch (error) {
        console.error('Error updating offer:', error)
        return null
    }
}

export async function deleteOfferItem(id: string): Promise<boolean> {
    try {
        await connectDB()
        const data = await getOrCreateOffersData()
        data.offers = data.offers.filter((o: any) => 
            (o._id ? o._id.toString() : o.id) !== id
        )
        
        await OffersData.findOneAndUpdate(
            {},
            { $set: { offers: data.offers } },
            { upsert: true }
        )
        return true
    } catch (error) {
        console.error('Error deleting offer item:', error)
        return false
    }
}

export async function updateOffersSection(updates: Partial<Pick<OffersData, 'sectionTitle' | 'sectionSubtitle' | 'isVisible'>>): Promise<OffersData> {
    try {
        await connectDB()
        const data = await getOrCreateOffersData()
        const updatedData = {
            ...data,
            ...updates
        }
        await OffersData.findOneAndUpdate(
            {},
            { $set: updatedData },
            { upsert: true }
        )
        return await getOffersData()
    } catch (error) {
        console.error('Error updating offers section:', error)
        throw error
    }
}

// Note: Image deletion from filesystem is handled separately if needed
export function deleteOfferImage(imagePath: string): void {
    // This function is kept for compatibility but file deletion
    // should be handled by your file storage service
    console.log('Image deletion should be handled by your file storage service:', imagePath)
}
