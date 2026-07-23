import connectDB from './mongodb'
import Settings, { ISettings } from './models/Settings'

export interface Settings {
    whatsappNumber: string
    contactPhone: string
    whatsappPhoneNumber: string
    whatsappMessageTemplate: string
}

const DEFAULT_SETTINGS: Settings = {
    whatsappNumber: '919818024742',
    contactPhone: '+91 9818024742',
    whatsappPhoneNumber: '919818024742',
    whatsappMessageTemplate: "Hi! I'm interested in {productName} - Rs. {price}. Can you provide more details?"
}

async function getOrCreateSettings(): Promise<ISettings> {
    await connectDB()
    let settings = await Settings.findOne().lean()

    if (!settings) {
        const newSettings = new Settings(DEFAULT_SETTINGS)
        const saved = await newSettings.save()
        settings = saved.toObject() as any
    }

    return settings as any as ISettings
}

export async function getSettings(): Promise<Settings> {
    try {
        const settings = await getOrCreateSettings()
        return {
            whatsappNumber: settings.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber,
            contactPhone: settings.contactPhone || DEFAULT_SETTINGS.contactPhone,
            whatsappPhoneNumber: settings.whatsappPhoneNumber,
            whatsappMessageTemplate: settings.whatsappMessageTemplate
        }
    } catch (error) {
        console.error('Error reading settings:', error)
        return DEFAULT_SETTINGS
    }
}

export async function saveSettings(settings: Settings): Promise<void> {
    try {
        await connectDB()
        await Settings.findOneAndUpdate(
            {},
            { $set: settings },
            { upsert: true, new: true }
        )
    } catch (error) {
        console.error('Error saving settings:', error)
        throw error
    }
}

export function formatWhatsAppMessage(template: string, productName: string, price: number): string {
    return template
        .replace(/{productName}/g, productName)
        .replace(/{price}/g, price.toString())
}
