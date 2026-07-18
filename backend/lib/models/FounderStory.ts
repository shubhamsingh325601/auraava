import mongoose, { Schema, Document } from 'mongoose'

export interface IFounderStory extends Document {
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

const FounderStorySchema = new Schema<IFounderStory>({
    name: { type: String, required: true },
    role: { type: String, required: true },
    photo: { type: String, required: true },
    quote: { type: String, required: true },
    story: { type: String, required: true },
    instagram: { type: String },
    linkedin: { type: String },
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

export default mongoose.models.FounderStory || mongoose.model<IFounderStory>('FounderStory', FounderStorySchema)
