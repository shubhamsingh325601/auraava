import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
    id: string
    name: string
    category: string
    shortDescription: string
    fullDescription: string
    price: number
    currency: string
    images: string[]
    mainImage: string
    rating: number
    reviews: number
    inStock: boolean
    sizes: string[]
    keyBenefits?: { label: string; icon: string }[]
    bestSeller?: boolean
    buttonText?: string
    buttonLink?: string
    whatsappPhoneNumber?: string
    whatsappMessageTemplate?: string
    directCheckoutEnabled?: boolean
    createdAt: string
}

const ProductSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    category: { type: String, required: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    images: { type: [String], default: [] },
    mainImage: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    bestSeller: { type: Boolean, default: false },
    sizes: { type: [String], default: [] },
    keyBenefits: [{
        label: { type: String },
        icon: { type: String }
    }],
    buttonText: { type: String },
    buttonLink: { type: String },
    whatsappPhoneNumber: { type: String },
    whatsappMessageTemplate: { type: String },
    directCheckoutEnabled: { type: Boolean, default: false },
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

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)

