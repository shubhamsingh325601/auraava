import connectDB from './mongodb'
import Settings, { ISettings } from './models/Settings'

export interface Settings {
    whatsappPhoneNumber: string
    whatsappMessageTemplate: string
}

async function getOrCreateSettings(): Promise<ISettings> {
    await connectDB()
    let settings = await Settings.findOne().lean()
    
    if (!settings) {
        const newSettings = new Settings({
            whatsappPhoneNumber: '918971690503',
            whatsappMessageTemplate: "Hi! I'm interested in {productName} - Rs. {price}. Can you provide more details?"
        })
        const saved = await newSettings.save()
        settings = saved.toObject() as any
    }
    
    return settings as any as ISettings
}

export async function getSettings(): Promise<Settings> {
    try {
        const settings = await getOrCreateSettings()
        return {
            whatsappPhoneNumber: settings.whatsappPhoneNumber,
            whatsappMessageTemplate: settings.whatsappMessageTemplate
        }
    } catch (error) {
        console.error('Error reading settings:', error)
        return {
            whatsappPhoneNumber: '918971690503',
            whatsappMessageTemplate: "Hi! I'm interested in {productName} - Rs. {price}. Can you provide more details?"
        }
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
