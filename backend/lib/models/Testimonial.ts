import mongoose, { Schema, Document } from 'mongoose'

export interface ITestimonial extends Document {
    id: string
    text: string
    author: string
    rating: number
    createdAt: string
}

const TestimonialSchema = new Schema<ITestimonial>({
    text: { type: String, required: true },
    author: { type: String, required: true },
    rating: { type: Number, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() }
}, {
    timestamps: false,
    toJSON: {
        transform: function(doc, ret: any) {
            ret.id = ret._id.toString()
            delete ret._id
            delete ret.__v
            return ret
        }
    }
})

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema)

