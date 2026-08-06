// Seeds the hero carousel with the current home page banner images so the
// backend-driven carousel shows the new banner slides. Re-running this
// replaces any existing banners, so it can be used to swap the live hero.
// Run with: npm run seed:hero-banners (from backend/)
import dotenv from 'dotenv'
dotenv.config()

import connectDB from '../lib/mongodb'
import HeroBanner from '../lib/models/HeroBanner'

const BANNERS = [
    { image: 'https://res.cloudinary.com/dmfxly4bz/image/upload/v1785988738/awals76ben6dstovirjm.png', link: '/products', order: 1, active: true },
    { image: 'https://res.cloudinary.com/dmfxly4bz/image/upload/v1785988740/vuzswfjigjqulcsxrjq5.png', link: '/products', order: 2, active: true },
    { image: 'https://res.cloudinary.com/dmfxly4bz/image/upload/v1785988747/fzygxsag8bnyvc07pesi.png', link: '/products', order: 3, active: true },
]

async function seed() {
    await connectDB()
    await HeroBanner.deleteMany({})
    const docs = BANNERS.map((b) => ({
        ...b,
        createdAt: new Date().toISOString()
    }))
    await HeroBanner.insertMany(docs)
    console.log(`Seeded ${docs.length} hero banner(s).`)
    process.exit(0)
}

seed().catch((error) => {
    console.error('Error seeding hero banners:', error)
    process.exit(1)
})
