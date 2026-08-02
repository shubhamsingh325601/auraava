// Seeds the hero carousel with the current home page banner images so the
// backend-driven carousel shows the same slides that were previously hardcoded.
// Run with: npm run seed:hero-banners (from backend/)
import dotenv from 'dotenv'
dotenv.config()

import connectDB from '../lib/mongodb'
import HeroBanner from '../lib/models/HeroBanner'

const BANNERS = [
    { image: 'https://res.cloudinary.com/dmfxly4bz/image/upload/v1785664260/myalmpfyx4tbzrikgy7s.png', link: '/products?category=oils', order: 1, active: true },
    { image: 'https://res.cloudinary.com/dmfxly4bz/image/upload/v1785664273/ub29uyexigd8qztfnxs3.png', link: '/products', order: 2, active: true },
    { image: 'https://res.cloudinary.com/dmfxly4bz/image/upload/v1785664273/e4amalxc66wkywfhyc4g.png', link: '/products', order: 3, active: true },
    { image: 'https://res.cloudinary.com/dmfxly4bz/image/upload/v1785664274/vzdvnnxjqcpfphktw6mk.png', link: '/products', order: 4, active: true },
]

async function seed() {
    await connectDB()
    const existing = await HeroBanner.countDocuments({})
    if (existing > 0) {
        console.log(`Skipping: hero banners collection already has ${existing} banner(s).`)
        process.exit(0)
    }
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
