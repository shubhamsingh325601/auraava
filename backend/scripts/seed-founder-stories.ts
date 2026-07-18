// Seeds a placeholder founder story if none exist yet.
// Run with: npm run seed:founder-stories (from backend/)
import dotenv from 'dotenv'
dotenv.config()

import connectDB from '../lib/mongodb'
import FounderStory from '../lib/models/FounderStory'

const FOUNDERS = [
    {
        name: 'Founder Name',
        role: 'Founder & CEO, Auraava',
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=600&fit=crop&crop=faces',
        quote: 'Pure ingredients for radiant hair and skin — that belief is where Auraava began.',
        story: 'Auraava was born from a simple frustration: shelves full of hair and skin products loaded with ingredients we couldn\'t pronounce, and none that felt made for us.\n\nSo we started small — researching traditional, plant-based formulas and pairing them with modern science, testing every batch ourselves before it ever reached a customer.\n\nToday, Auraava is built on that same promise: natural, effective self-care, backed by science, made for real people.',
        instagram: 'https://instagram.com/auraavacare',
        linkedin: 'https://linkedin.com/company/auraavacare',
        order: 0,
    },
]

async function seed() {
    await connectDB()
    const count = await FounderStory.countDocuments({})
    if (count > 0) {
        console.log(`Founder stories already seeded (${count} found). Skipping.`)
        process.exit(0)
    }
    await FounderStory.insertMany(FOUNDERS)
    console.log(`Seeded ${FOUNDERS.length} founder story(ies). Edit the real details at /admin/founder-stories.`)
    process.exit(0)
}

seed().catch((error) => {
    console.error('Error seeding founder stories:', error)
    process.exit(1)
})
