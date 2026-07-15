import connectDB from './mongodb'
import Testimonial, { ITestimonial } from './models/Testimonial'

export interface Testimonial {
  id: string
  text: string
  author: string
  rating: number
  createdAt: string
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    await connectDB()
    const testimonials = await Testimonial.find({}).lean()
    return testimonials.map((t: any) => ({
      ...t,
      id: t._id ? t._id.toString() : t.id
    })) as Testimonial[]
  } catch (error) {
    console.error('Error reading testimonials:', error)
    return []
  }
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  try {
    await connectDB()
    const testimonial = await Testimonial.findById(id).lean()
    if (!testimonial) return null
    const testimonialObj = testimonial as any
    return {
      ...testimonialObj,
      id: testimonialObj._id ? testimonialObj._id.toString() : testimonialObj.id
    } as Testimonial
  } catch (error) {
    console.error('Error reading testimonial:', error)
    return null
  }
}

export async function saveTestimonials(testimonials: Testimonial[]): Promise<void> {
  try {
    await connectDB()
    await Testimonial.deleteMany({})
    const testimonialsToSave = testimonials.map(t => {
      const { id, ...testimonialData } = t
      return testimonialData
    })
    await Testimonial.insertMany(testimonialsToSave)
  } catch (error) {
    console.error('Error saving testimonials:', error)
    throw error
  }
}

export async function addTestimonial(testimonial: Omit<Testimonial, 'id' | 'createdAt'>): Promise<Testimonial> {
  try {
    await connectDB()
    const newTestimonial = new Testimonial({
      ...testimonial,
      createdAt: new Date().toISOString()
    })
    const saved = await newTestimonial.save()
    return {
      ...saved.toObject(),
      id: saved._id.toString()
    } as Testimonial
  } catch (error) {
    console.error('Error adding testimonial:', error)
    throw error
  }
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial | null> {
  try {
    await connectDB()
    const { id: _, ...updateData } = updates
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).lean()
    
    if (!testimonial) return null
    
    const testimonialObj = testimonial as any
    return {
      ...testimonialObj,
      id: testimonialObj._id ? testimonialObj._id.toString() : testimonialObj.id
    } as Testimonial
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return null
  }
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  try {
    await connectDB()
    const result = await Testimonial.findByIdAndDelete(id)
    return result !== null
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return false
  }
}
