import mongoose, { Schema, Document } from 'mongoose'

export interface IHeroBanner extends Document {
    id: string
    image: string
    link: string
    order: number
    active: boolean
    createdAt: string
}

const HeroBannerSchema = new Schema<IHeroBanner>({
    image: { type: String, required: true },
    link: { type: String, default: '/products' },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
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

export default mongoose.models.HeroBanner || mongoose.model<IHeroBanner>('HeroBanner', HeroBannerSchema)
