import mongoose, { Schema, Document } from 'mongoose'

export interface IInstagramPost extends Document {
    id: string
    image: string
    link?: string
    order: number
    createdAt: string
}

export interface IInstagramData extends Document {
    id: string
    sectionTitle: string
    sectionSubtitle: string
    posts: IInstagramPost[]
}

const InstagramPostSchema = new Schema<IInstagramPost>({
    image: { type: String, required: true },
    link: { type: String },
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

const InstagramDataSchema = new Schema<IInstagramData>({
    sectionTitle: { type: String, default: 'Follow Us On Social Media' },
    sectionSubtitle: { type: String, default: 'Join The Manetain Fam' },
    posts: { type: [InstagramPostSchema], default: [] }
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

export const InstagramPost = mongoose.models.InstagramPost || mongoose.model<IInstagramPost>('InstagramPost', InstagramPostSchema)
export default mongoose.models.InstagramData || mongoose.model<IInstagramData>('InstagramData', InstagramDataSchema)

