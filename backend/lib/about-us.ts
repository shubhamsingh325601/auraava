import connectDB from './mongodb'
import AboutUsSection, { IAboutUsSection } from './models/AboutUs'

export interface AboutUsSection {
    id: string
    title: string
    subtitle?: string
    content: string
    image: string
    backgroundColor: string
    textColor: string
    layout: 'text-left' | 'text-right'
    order: number
}

export interface AboutUsData {
    sections: AboutUsSection[]
}

export async function getAboutUsData(): Promise<AboutUsData> {
    try {
        await connectDB()
        const sections = await AboutUsSection.find({})
            .sort({ order: 1 })
            .lean()
        return {
            sections: sections.map((s: any) => ({
                ...s,
                id: s._id ? s._id.toString() : s.id
            })) as AboutUsSection[]
        }
    } catch (error) {
        console.error('Error reading about-us data:', error)
        return {
            sections: []
        }
    }
}

export async function getAboutUsSections(): Promise<AboutUsSection[]> {
    const data = await getAboutUsData()
    return data.sections
}

export async function getAboutUsSectionById(id: string): Promise<AboutUsSection | null> {
    try {
        await connectDB()
        const section = await AboutUsSection.findById(id).lean()
        if (!section) return null
        const sectionObj = section as any
        return {
            ...sectionObj,
            id: sectionObj._id ? sectionObj._id.toString() : sectionObj.id
        } as AboutUsSection
    } catch (error) {
        console.error('Error reading about-us section:', error)
        return null
    }
}

export async function saveAboutUsData(data: AboutUsData): Promise<void> {
    try {
        await connectDB()
        await AboutUsSection.deleteMany({})
        const sectionsToSave = data.sections.map(s => {
            const { id, ...sectionData } = s
            return sectionData
        })
        await AboutUsSection.insertMany(sectionsToSave)
    } catch (error) {
        console.error('Error saving about-us data:', error)
        throw error
    }
}

export async function updateAboutUsSection(id: string, updates: Partial<AboutUsSection>): Promise<AboutUsSection | null> {
    try {
        await connectDB()
        const { id: _, ...updateData } = updates
        const section = await AboutUsSection.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        ).lean()
        
        if (!section) return null
        
        const sectionObj = section as any
        return {
            ...sectionObj,
            id: sectionObj._id ? sectionObj._id.toString() : sectionObj.id
        } as AboutUsSection
    } catch (error) {
        console.error('Error updating about-us section:', error)
        return null
    }
}

export async function addAboutUsSection(section: Omit<AboutUsSection, 'id'>): Promise<AboutUsSection> {
    try {
        await connectDB()
        const newSection = new AboutUsSection(section)
        const saved = await newSection.save()
        return {
            ...saved.toObject(),
            id: saved._id.toString()
        } as AboutUsSection
    } catch (error) {
        console.error('Error adding about-us section:', error)
        throw error
    }
}

export async function deleteAboutUsSection(id: string): Promise<boolean> {
    try {
        await connectDB()
        const result = await AboutUsSection.findByIdAndDelete(id)
        return result !== null
    } catch (error) {
        console.error('Error deleting about-us section:', error)
        return false
    }
}

// Note: Image deletion from filesystem is handled separately if needed
export function deleteAboutUsImage(imagePath: string): void {
    // This function is kept for compatibility but file deletion
    // should be handled by your file storage service
    console.log('Image deletion should be handled by your file storage service:', imagePath)
}
