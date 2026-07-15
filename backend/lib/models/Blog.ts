import mongoose, { Schema, Document } from 'mongoose'

export interface IBlog extends Document {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    author: string
    category: string
    image: string
    publishedAt: string
    createdAt: string
}

const BlogSchema = new Schema<IBlog>({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    publishedAt: { type: String, required: true },
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

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema)

