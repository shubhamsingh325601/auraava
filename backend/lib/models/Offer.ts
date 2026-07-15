import mongoose, { Schema, Document } from 'mongoose'

export interface IOfferItem extends Document {
    id: string
    title: string
    description: string
    image: string
    discount: string
    link: string
    order: number
}

export interface IOffersData extends Document {
    id: string
    sectionTitle: string
    sectionSubtitle: string
    isVisible: boolean
    offers: IOfferItem[]
}

const OfferItemSchema = new Schema<IOfferItem>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    discount: { type: String, required: true },
    link: { type: String, required: true },
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

const OffersDataSchema = new Schema<IOffersData>({
    sectionTitle: { type: String, default: '✨ Mega Sale Week ✨' },
    sectionSubtitle: { type: String, default: '' },
    isVisible: { type: Boolean, default: true },
    offers: { type: [OfferItemSchema], default: [] }
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

export const OfferItem = mongoose.models.OfferItem || mongoose.model<IOfferItem>('OfferItem', OfferItemSchema)
export default mongoose.models.OffersData || mongoose.model<IOffersData>('OffersData', OffersDataSchema)

