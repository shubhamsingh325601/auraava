import connectDB from './mongodb'
import FounderStory, { IFounderStory } from './models/FounderStory'

export interface FounderStoryData {
    id: string
    name: string
    role: string
    photo: string
    quote: string
    story: string
    instagram?: string
    linkedin?: string
    order: number
}

export async function getFounderStories(): Promise<FounderStoryData[]> {
    try {
        await connectDB()
        const stories = await FounderStory.find({}).sort({ order: 1 }).lean()
        return stories.map((s: any) => ({
            ...s,
            id: s._id ? s._id.toString() : s.id
        })) as FounderStoryData[]
    } catch (error) {
        console.error('Error reading founder stories:', error)
        return []
    }
}

export async function getFounderStoryById(id: string): Promise<FounderStoryData | null> {
    try {
        await connectDB()
        const story = await FounderStory.findById(id).lean()
        if (!story) return null
        const storyObj = story as any
        return {
            ...storyObj,
            id: storyObj._id ? storyObj._id.toString() : storyObj.id
        } as FounderStoryData
    } catch (error) {
        console.error('Error reading founder story:', error)
        return null
    }
}

export async function addFounderStory(story: Omit<FounderStoryData, 'id'>): Promise<FounderStoryData> {
    try {
        await connectDB()
        const newStory = new FounderStory(story)
        const saved = await newStory.save()
        return {
            ...saved.toObject(),
            id: saved._id.toString()
        } as FounderStoryData
    } catch (error) {
        console.error('Error adding founder story:', error)
        throw error
    }
}

export async function updateFounderStory(id: string, updates: Partial<FounderStoryData>): Promise<FounderStoryData | null> {
    try {
        await connectDB()
        const { id: _, ...updateData } = updates
        const story = await FounderStory.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        ).lean()

        if (!story) return null

        const storyObj = story as any
        return {
            ...storyObj,
            id: storyObj._id ? storyObj._id.toString() : storyObj.id
        } as FounderStoryData
    } catch (error) {
        console.error('Error updating founder story:', error)
        return null
    }
}

export async function deleteFounderStory(id: string): Promise<boolean> {
    try {
        await connectDB()
        const result = await FounderStory.findByIdAndDelete(id)
        return result !== null
    } catch (error) {
        console.error('Error deleting founder story:', error)
        return false
    }
}
