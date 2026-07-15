import mongoose, { Schema, Document } from 'mongoose'

export interface IHairCareItem extends Document {
    id: string
    title: string
    description: string
    image: string
    reverse: boolean
    order: number
    createdAt: string
}

export interface IHairCareData extends Document {
    id: string
    sectionTitle: string
    sectionDescription: string
    items: IHairCareItem[]
}

const HairCareItemSchema = new Schema<IHairCareItem>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    reverse: { type: Boolean, default: false },
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

const HairCareDataSchema = new Schema<IHairCareData>({
    sectionTitle: { type: String, default: 'Hair Care Essentials 🌸' },
    sectionDescription: { type: String, default: '' },
    items: { type: [HairCareItemSchema], default: [] }
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

export const HairCareItem = mongoose.models.HairCareItem || mongoose.model<IHairCareItem>('HairCareItem', HairCareItemSchema)
export default mongoose.models.HairCareData || mongoose.model<IHairCareData>('HairCareData', HairCareDataSchema)

