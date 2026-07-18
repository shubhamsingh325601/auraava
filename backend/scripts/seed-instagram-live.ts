// Replaces the placeholder Instagram/social section posts with the real posts
// currently live on https://www.auraava.com/ (pulled from its /api/instagram).
// Run with: npm run seed:instagram (from backend/)
import dotenv from 'dotenv'
dotenv.config()

import connectDB from '../lib/mongodb'
import InstagramData from '../lib/models/Instagram'

const LIVE_POSTS = [
    { image: 'https://res.cloudinary.com/dmfxly4bz/image/upload/v1765549650/lpqxw6zziot8ckdcnese.png', link: 'https://www.instagram.com/reel/DFQgyRXT7EY/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', order: 0 },
    { image: 'https://res.cloudinary.com/dmfxly4bz/image/upload/v1765549709/eqy84djpay0mxupjo0zj.png', link: 'https://www.instagram.com/reel/DCR9JTwRef4/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', order: 1 },
    { image: 'https://res.cloudinary.com/dmfxly4bz/image/upload/v1765549753/nrq0sufts9sqkcdqpvx6.png', link: 'https://www.instagram.com/reel/DBaqqLGRU-s/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', order: 2 },
    { image: 'https://res.cloudinary.com/dmfxly4bz/image/upload/v1765549805/osl7ebm6ilas3rzrc7he.png', link: 'https://www.instagram.com/reel/DAkYbddx8CF/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', order: 3 },
    { image: 'https://res.cloudinary.com/dmfxly4bz/image/upload/v1765549844/vn1his5qgwugtrfapg9e.png', link: 'https://www.instagram.com/reel/C_YXNoxxgHq/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', order: 4 },
]

async function seed() {
    await connectDB()
    let doc = await InstagramData.findOne({})
    if (!doc) {
        doc = new InstagramData({ sectionTitle: 'Follow us for daily hair care inspiration', sectionSubtitle: '@auraavacare' })
    }
    doc.posts = LIVE_POSTS as any
    await doc.save()
    console.log(`Updated instagram section with ${LIVE_POSTS.length} live post(s) from auraava.com.`)
    process.exit(0)
}

seed().catch((error) => {
    console.error('Error seeding live instagram posts:', error)
    process.exit(1)
})
