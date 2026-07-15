import mongoose, { Schema, Document } from 'mongoose'

export interface IAboutUsSection extends Document {
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

const AboutUsSectionSchema = new Schema<IAboutUsSection>({
    title: { type: String, required: true },
    subtitle: { type: String },
    content: { type: String, required: true },
    image: { type: String, required: true },
    backgroundColor: { type: String, required: true },
    textColor: { type: String, required: true },
    layout: { type: String, enum: ['text-left', 'text-right'], default: 'text-left' },
    order: { type: Number, default: 0 }
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

export default mongoose.models.AboutUsSection || mongoose.model<IAboutUsSection>('AboutUsSection', AboutUsSectionSchema)

