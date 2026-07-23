import mongoose, { Schema, Document } from 'mongoose'

export interface ISettings extends Document {
    id: string
    whatsappNumber: string
    contactPhone: string
    whatsappPhoneNumber: string
    whatsappMessageTemplate: string
}

const SettingsSchema = new Schema<ISettings>({
    // General site-wide WhatsApp contact number (floating button, footer, nav "Chat" links)
    whatsappNumber: { type: String, default: '919818024742' },
    // Display phone number shown alongside the WhatsApp number (tel: links)
    contactPhone: { type: String, default: '+91 9818024742' },
    whatsappPhoneNumber: { type: String, default: '919818024742' },
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

