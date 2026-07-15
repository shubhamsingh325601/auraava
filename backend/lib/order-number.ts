import connectDB from './mongodb'
import Order from './models/Order'

// Human-readable order number, e.g. AUR-2026-000123. Retries on the rare
// collision since the sequence is derived from a same-year document count
// rather than an atomic counter.
export async function generateOrderNumber(): Promise<string> {
    await connectDB()
    const year = new Date().getFullYear()
    const prefix = `AUR-${year}-`

    const count = await Order.countDocuments({ orderNumber: { $regex: `^${prefix}` } })
    let sequence = count + 1

    for (let attempt = 0; attempt < 10; attempt++) {
        const candidate = `${prefix}${sequence.toString().padStart(6, '0')}`
        const exists = await Order.exists({ orderNumber: candidate })
        if (!exists) return candidate
        sequence++
    }

    throw new Error('Failed to generate a unique order number')
}
