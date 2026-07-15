import mongoose, { Schema, Document } from 'mongoose'

export interface IFAQ extends Document {
    id: string
    question: string
    answer: string
    order: number
    createdAt: string
}

const FAQSchema = new Schema<IFAQ>({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
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

export default mongoose.models.FAQ || mongoose.model<IFAQ>('FAQ', FAQSchema)

