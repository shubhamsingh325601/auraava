import mongoose, { Schema, Document } from 'mongoose'

export interface ISettings extends Document {
    id: string
    whatsappPhoneNumber: string
    whatsappMessageTemplate: string
}

const SettingsSchema = new Schema<ISettings>({
    whatsappPhoneNumber: { type: String, default: '918971690503' },
    whatsappMessageTemplate: { 
        type: String, 
        default: "Hi! I'm interested in {productName} - Rs. {price}. Can you provide more details?" 
    }
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

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema)

