import connectDB from './mongodb'
import FAQ, { IFAQ } from './models/FAQ'

export interface FAQ {
  id: string
  question: string
  answer: string
  order: number
  createdAt: string
}

export async function getFAQs(): Promise<FAQ[]> {
  try {
    await connectDB()
    const faqs = await FAQ.find({})
      .sort({ order: 1 })
      .lean()
    return faqs.map((f: any) => ({
      ...f,
      id: f._id ? f._id.toString() : f.id
    })) as FAQ[]
  } catch (error) {
    console.error('Error reading FAQs:', error)
    return []
  }
}

export async function getFAQById(id: string): Promise<FAQ | null> {
  try {
    await connectDB()
    const faq = await FAQ.findById(id).lean()
    if (!faq) return null
    const faqObj = faq as any
    return {
      ...faqObj,
      id: faqObj._id ? faqObj._id.toString() : faqObj.id
    } as FAQ
  } catch (error) {
    console.error('Error reading FAQ:', error)
    return null
  }
}

export async function saveFAQs(faqs: FAQ[]): Promise<void> {
  try {
    await connectDB()
    await FAQ.deleteMany({})
    const faqsToSave = faqs.map(f => {
      const { id, ...faqData } = f
      return faqData
    })
    await FAQ.insertMany(faqsToSave)
  } catch (error) {
    console.error('Error saving FAQs:', error)
    throw error
  }
}

export async function addFAQ(faq: Omit<FAQ, 'id' | 'createdAt'>): Promise<FAQ> {
  try {
    await connectDB()
    const newFAQ = new FAQ({
      ...faq,
      createdAt: new Date().toISOString()
    })
    const saved = await newFAQ.save()
    return {
      ...saved.toObject(),
      id: saved._id.toString()
    } as FAQ
  } catch (error) {
    console.error('Error adding FAQ:', error)
    throw error
  }
}

export async function updateFAQ(id: string, updates: Partial<FAQ>): Promise<FAQ | null> {
  try {
    await connectDB()
    const { id: _, ...updateData } = updates
    const faq = await FAQ.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).lean()
    
    if (!faq) return null
    
    const faqObj = faq as any
    return {
      ...faqObj,
      id: faqObj._id ? faqObj._id.toString() : faqObj.id
    } as FAQ
  } catch (error) {
    console.error('Error updating FAQ:', error)
    return null
  }
}

export async function deleteFAQ(id: string): Promise<boolean> {
  try {
    await connectDB()
    const result = await FAQ.findByIdAndDelete(id)
    return result !== null
  } catch (error) {
    console.error('Error deleting FAQ:', error)
    return false
  }
}
