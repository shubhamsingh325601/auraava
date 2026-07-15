import connectDB from './mongodb'
import StatsData, { IStatsData, IStatItem } from './models/Stat'

export interface StatItem {
    id: string
    label: string
    number: string
    order: number
}

export interface StatsData {
    items: StatItem[]
}

async function getOrCreateStatsData(): Promise<IStatsData> {
    await connectDB()
    let data = await StatsData.findOne().lean()
    
    if (!data) {
        const newData = new StatsData({
            items: []
        })
        const saved = await newData.save()
        data = saved.toObject() as any
    }
    
    return data as any as IStatsData
}

export async function getStatsData(): Promise<StatsData> {
    try {
        const data = await getOrCreateStatsData()
        const items = (data.items || []).sort((a: any, b: any) => a.order - b.order)
        return {
            items: items.map((i: any) => ({
                ...i,
                id: i._id ? i._id.toString() : i.id
            }))
        }
    } catch (error) {
        console.error('Error reading stats data:', error)
        return {
            items: []
        }
    }
}

export async function getStats(): Promise<StatItem[]> {
    const data = await getStatsData()
    return data.items
}

export async function saveStatsData(data: StatsData): Promise<void> {
    try {
        await connectDB()
        await StatsData.findOneAndUpdate(
            {},
            { $set: data },
            { upsert: true, new: true }
        )
    } catch (error) {
        console.error('Error saving stats data:', error)
        throw error
    }
}

export async function updateStatItem(id: string, updates: Partial<StatItem>): Promise<StatItem | null> {
    try {
        await connectDB()
        const data = await getOrCreateStatsData()
        const itemIndex = data.items.findIndex((i: any) => 
            (i._id ? i._id.toString() : i.id) === id
        )
        
        if (itemIndex === -1) return null
        
        const { id: _, ...updateData } = updates
        data.items[itemIndex] = { ...data.items[itemIndex], ...updateData } as any
        
        await StatsData.findOneAndUpdate(
            {},
            { $set: { items: data.items } },
            { upsert: true }
        )
        
        return data.items[itemIndex] as StatItem
    } catch (error) {
        console.error('Error updating stat item:', error)
        return null
    }
}

export async function addStatItem(item: Omit<StatItem, 'id'>): Promise<StatItem> {
    try {
        await connectDB()
        const data = await getOrCreateStatsData()
        const newItem = item as any
        data.items.push(newItem)
        await StatsData.findOneAndUpdate(
            {},
            { $set: { items: data.items } },
            { upsert: true }
        )
        return {
            ...newItem,
            id: Date.now().toString()
        } as StatItem
    } catch (error) {
        console.error('Error adding stat item:', error)
        throw error
    }
}

export async function deleteStatItem(id: string): Promise<boolean> {
    try {
        await connectDB()
        const data = await getOrCreateStatsData()
        data.items = data.items.filter((i: any) => 
            (i._id ? i._id.toString() : i.id) !== id
        )
        await StatsData.findOneAndUpdate(
            {},
            { $set: { items: data.items } },
            { upsert: true }
        )
        return true
    } catch (error) {
        console.error('Error deleting stat item:', error)
        return false
    }
}
