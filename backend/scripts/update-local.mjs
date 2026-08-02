// One-shot data sync script (ESM, run from backend/):
//   MONGODB_URI="<connection-string>" node scripts/update-local.mjs
// Defaults to the local dev DB when MONGODB_URI is not set.
//
// Applies:
//   - Stats:      Happy Customers → 5K, Average Rating → 4.9, Natural Products → Pan India Delivery 100%
//   - Founder:    designation Founder & CEO → Founder (name stays as-is — client-provided)
//   - Products:   enable direct checkout (Shop Now) for Hair Oils + Shampoos
import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/auraava'
await mongoose.connect(uri)
const db = mongoose.connection.db

// 1. Stats
const statsCollection = db.collection('statsdatas')
const statsDoc = await statsCollection.findOne()
if (statsDoc) {
  const items = statsDoc.items.map(item => {
    if (item.label === 'Happy Customers') return { ...item, number: '5K' }
    if (item.label === 'Natural Products') return { ...item, label: 'Pan India Delivery', number: '100%' }
    if (item.label === 'Average Rating') return { ...item, number: '4.9' }
    return item
  })
  await statsCollection.updateOne({}, { $set: { items } })
  console.log('Stats updated:', JSON.stringify(items))
} else {
  console.log('No stats doc found')
}

// 2. Founder: designation Founder & CEO → Founder
const founderCollection = db.collection('founderstories')
const founders = await founderCollection.find({}).toArray()
console.log('Founders found:', founders.length)
for (const f of founders) {
  if (f.role && /CEO/i.test(f.role)) {
    await founderCollection.updateOne(
      { _id: f._id },
      { $set: { role: 'Founder, Auraava' } }
    )
    console.log('Updated founder role:', f._id.toString())
  }
}

// 3. Products: enable direct checkout for Hair Oils + Shampoos
const productsCollection = db.collection('products')
const result = await productsCollection.updateMany(
  { category: { $in: ['oils', 'shampoos'] } },
  { $set: { directCheckoutEnabled: true } }
)
console.log(`Products updated (directCheckoutEnabled): ${result.modifiedCount}`)

await mongoose.disconnect()
console.log('Update complete.')
