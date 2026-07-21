// One-off content seed matching the auraava-bloom reference design's site-data.ts.
// Run with: npm run seed (from backend/)
import dotenv from 'dotenv'
dotenv.config()

import connectDB from '../lib/mongodb'
import Product from '../lib/models/Product'
import OffersData from '../lib/models/Offer'
import Testimonial from '../lib/models/Testimonial'
import FAQ from '../lib/models/FAQ'
import HairCareData from '../lib/models/Skincare'
import InstagramData from '../lib/models/Instagram'
import Blog from '../lib/models/Blog'
import AboutUsSection from '../lib/models/AboutUs'
import StatsData from '../lib/models/Stat'

const img = (name: string) => `/images/${name}`

const PRODUCTS = [
    {
        name: 'Amla & Bhringraj Hair Oil', category: 'oils',
        shortDescription: 'Cold-pressed Ayurvedic oil for stronger, longer hair.',
        fullDescription: 'A timeless blend of Amla, Bhringraj and Sesame oils, cold-pressed and slow-infused to deeply nourish the scalp, awaken roots and restore natural shine.',
        price: 599, images: [img('prod-1.jpg')], mainImage: img('prod-1.jpg'), rating: 4.9, reviews: 218, bestSeller: true, inStock: true,
        keyBenefits: [{ label: 'Reduces hair fall', icon: 'Sparkles' }, { label: 'Boosts root strength', icon: 'Sparkles' }, { label: 'Adds natural shine', icon: 'Sparkles' }, { label: 'Soothes scalp', icon: 'Sparkles' }],
    },
    {
        name: 'Rose & Jojoba Cleansing Shampoo', category: 'shampoos',
        shortDescription: 'Sulphate-free shampoo that cleanses gently and softens hair.',
        fullDescription: 'A luxuriously creamy, sulphate-free shampoo infused with Damask Rose, Jojoba and Aloe Vera — for hair that feels clean, soft and beautifully fragrant.',
        price: 749, images: [img('prod-2.jpg')], mainImage: img('prod-2.jpg'), rating: 4.8, reviews: 162, bestSeller: true, inStock: true,
        keyBenefits: [{ label: 'Sulphate-free formula', icon: 'Sparkles' }, { label: 'Hydrates the scalp', icon: 'Sparkles' }, { label: 'Safe for colored hair', icon: 'Sparkles' }, { label: 'Adds softness', icon: 'Sparkles' }],
    },
    {
        name: 'Rose Glow Hair Serum', category: 'serums',
        shortDescription: 'Lightweight serum for frizz-free, glossy strands.',
        fullDescription: 'A weightless serum with rose otto, argan and vitamin E that smooths frizz, seals split ends and leaves hair luminous all day.',
        price: 899, images: [img('prod-3.jpg')], mainImage: img('prod-3.jpg'), rating: 4.9, reviews: 304, bestSeller: true, inStock: true,
        keyBenefits: [{ label: 'Frizz control', icon: 'Sparkles' }, { label: 'Adds high shine', icon: 'Sparkles' }, { label: 'Heat protection', icon: 'Sparkles' }, { label: 'Non-greasy finish', icon: 'Sparkles' }],
    },
    {
        name: 'Lavender Mist Hair Spray', category: 'sprays',
        shortDescription: 'A botanical mist that refreshes and sets your style.',
        fullDescription: 'A soft-hold botanical spray with French lavender and provitamin B5 that refreshes hair, tames flyaways and sets your style with a delicate floral finish.',
        price: 649, images: [img('prod-4.jpg')], mainImage: img('prod-4.jpg'), rating: 4.7, reviews: 96, bestSeller: false, inStock: true,
        keyBenefits: [{ label: 'Tames flyaways', icon: 'Sparkles' }, { label: 'Soft natural hold', icon: 'Sparkles' }, { label: 'Refreshes hair', icon: 'Sparkles' }, { label: 'Aromatherapy benefits', icon: 'Sparkles' }],
    },
    {
        name: 'Moringa Daily Shine Oil', category: 'oils',
        shortDescription: 'A lightweight everyday oil for instant softness.',
        fullDescription: 'Moringa and almond oils blend into a silky, fast-absorbing formula that hydrates dry ends and adds an enviable glossy finish.',
        price: 499, images: [img('prod-5.jpg')], mainImage: img('prod-5.jpg'), rating: 4.6, reviews: 71, bestSeller: false, inStock: true,
        keyBenefits: [{ label: 'Lightweight, non-greasy', icon: 'Sparkles' }, { label: 'Tames dry ends', icon: 'Sparkles' }, { label: 'Locks in moisture', icon: 'Sparkles' }, { label: 'Daily-use safe', icon: 'Sparkles' }],
    },
    {
        name: 'Argan Repair Serum', category: 'serums',
        shortDescription: 'Repair serum for chemically-treated, damaged hair.',
        fullDescription: 'Cold-pressed Moroccan argan oil with bamboo extract restores elasticity, mends split ends and rebuilds shine — for hair that bounces back.',
        price: 999, images: [img('prod-6.jpg')], mainImage: img('prod-6.jpg'), rating: 4.8, reviews: 142, bestSeller: true, inStock: true,
        keyBenefits: [{ label: 'Repairs split ends', icon: 'Sparkles' }, { label: 'Restores elasticity', icon: 'Sparkles' }, { label: 'Color-safe', icon: 'Sparkles' }, { label: 'Deep nourishment', icon: 'Sparkles' }],
    },
]

const OFFERS = [
    { title: 'Hair Care Ritual Set', description: 'Oil + Shampoo + Serum at a beautiful bundled price.', discount: '20% OFF', image: img('cat-oils.png'), link: '/products', order: 0 },
    { title: 'First Order Glow', description: 'Flat ₹150 off on your very first Auraava order.', discount: '₹150 OFF', image: img('cat-serum.png'), link: '/products', order: 1 },
    { title: 'Free Shipping', description: 'Complimentary shipping on every order above ₹999.', discount: 'FREE', image: img('cat-shampoo.png'), link: '/products', order: 2 },
]

const TESTIMONIALS = [
    { text: "My hair has never felt this strong. I've finally found a brand that delivers on every promise — and smells divine.", author: 'Anika S., Mumbai', rating: 5 },
    { text: "The Rose Glow Serum is pure magic. A single drop and my hair looks salon-finished. I'm never going back.", author: 'Priya R., Bengaluru', rating: 5 },
    { text: 'Genuinely natural, beautifully packaged and it works. Auraava feels like a love letter to Indian hair care.', author: 'Meera K., Delhi', rating: 5 },
]

const FAQS = [
    { question: 'Are Auraava products 100% natural?', answer: 'Yes. Every Auraava formulation is plant-based, cruelty-free and made with ethically sourced, naturally derived ingredients — no parabens, sulphates or silicones.', order: 0 },
    { question: 'How do I place an order?', answer: 'Simply tap the WhatsApp button on any product and our team will guide you through availability, payment and delivery — Mon to Sat, 10 AM to 7 PM IST.', order: 1 },
    { question: 'Do you ship across India?', answer: 'Yes, we ship pan-India. Orders above ₹999 ship complimentary, and most deliveries reach you within 3–6 business days.', order: 2 },
    { question: 'Are your products safe for color-treated hair?', answer: 'Absolutely. Our sulphate-free shampoos and lightweight serums are gentle enough for color-treated, chemically-processed and sensitive scalps.', order: 3 },
    { question: 'What is your return policy?', answer: "If a product arrives damaged or doesn't meet our quality standards, write to us within 7 days at customer@auraava.com and we'll make it right.", order: 4 },
]

const HAIRCARE_ITEMS = [
    { title: 'Start With Your Scalp', description: 'Healthy hair grows from a healthy scalp. Begin with a weekly warm-oil massage to wake up roots, calm tension and improve circulation.', image: img('cat-oils.png'), reverse: false, order: 0 },
    { title: "Cleanse, Don't Strip", description: "Avoid harsh sulphates. Choose plant-based shampoos that gently lift impurities while preserving your hair's natural oils.", image: img('cat-shampoo.png'), reverse: true, order: 1 },
    { title: 'Seal With a Serum', description: 'A few drops of lightweight serum on damp ends locks in hydration, controls frizz and adds the kind of shine you can see across the room.', image: img('cat-serum.png'), reverse: false, order: 2 },
]

const INSTAGRAM_POSTS = [
    { image: img('cat-oils.png'), order: 0 },
    { image: img('cat-serum.png'), order: 1 },
    { image: img('cat-shampoo.png'), order: 2 },
    { image: img('cat-spray.png'), order: 3 },
    { image: img('prod-3.jpg'), order: 4 },
    { image: img('prod-1.jpg'), order: 5 },
]

const STATS_ITEMS = [
    { label: 'Happy Customers', number: '10K+', order: 0 },
    { label: 'Average Rating', number: '4.9★', order: 1 },
    { label: 'Natural Products', number: '50+', order: 2 },
    { label: 'Years of Care', number: '5+', order: 3 },
]

const BLOGS = [
    {
        slug: 'ayurvedic-secrets-for-hair-growth', title: '5 Ayurvedic Secrets for Naturally Longer Hair',
        excerpt: 'From warm oil rituals to the wisdom of Bhringraj — the ancient practices that still make Indian hair the envy of the world.',
        category: 'Rituals', author: 'Aanya Rao', publishedAt: '2026-05-12', image: img('prod-1.jpg'),
        content: [
            'For centuries, Ayurveda has treated hair not as a beauty accessory but as an extension of vitality. Long, glossy, resilient hair was — and still is — the natural byproduct of a well-cared-for body and mind.',
            'The first ritual is champi: a slow, warm-oil scalp massage that awakens circulation at the roots. Two nights a week is enough to transform density in a matter of months.',
            'The second is choosing your herbs wisely. Bhringraj, Amla and Brahmi remain the trinity most trusted by kitchen apothecaries across India.',
            "The third: cleanse gently. Sulphates strip more than dirt — they strip your hair's own defenses. A plant-based shampoo protects the delicate scalp microbiome.",
            'Fourth, seal moisture with a lightweight serum. And fifth — perhaps most important — sleep on silk and let your hair rest.',
        ].join('\n\n'),
    },
    {
        slug: 'why-sulphate-free-matters', title: 'Why Sulphate-Free Shampoo Is Non-Negotiable',
        excerpt: "Sulphates lather beautifully — but at a cost. Here's what they really do to your scalp and how to switch without missing the suds.",
        category: 'Ingredients', author: 'Devika Menon', publishedAt: '2026-04-28', image: img('prod-2.jpg'),
        content: [
            'Sulphates are surfactants — the aggressive foaming agents behind most drugstore shampoos. They cleanse, yes, but they also strip your scalp of its protective sebum layer.',
            'The result: dryness, itchiness, faster color-fade and, over time, a scalp that overcompensates by producing more oil than ever.',
            'Modern plant-based cleansers derived from coconut or sugar deliver a satisfying lather without the damage.',
        ].join('\n\n'),
    },
    {
        slug: 'serum-styling-guide', title: 'The Ultimate Serum Styling Guide',
        excerpt: 'Two drops or twenty? Damp hair or dry? A gentle primer on the tiny bottle that could transform your daily routine.',
        category: 'How-To', author: 'Meera Kapoor', publishedAt: '2026-04-10', image: img('prod-3.jpg'),
        content: [
            "A hair serum is neither an oil nor a leave-in conditioner. It's a lightweight sealant designed to smooth the cuticle and add shine without weight.",
            'Rule one: less is more. Two to three drops for medium-length hair. Warm between the palms and press into damp mid-lengths and ends.',
            'Rule two: never on the scalp. Serums are for the lengths — the scalp has its own natural oils.',
        ].join('\n\n'),
    },
    {
        slug: 'monsoon-hair-care', title: 'Monsoon Hair Care: A Survival Guide',
        excerpt: "Humidity, frizz and unexpected downpours don't have to ruin your hair. Here's the Auraava way to stay glossy all season.",
        category: 'Seasonal', author: 'Aanya Rao', publishedAt: '2026-03-22', image: img('prod-4.jpg'),
        content: [
            'Monsoon rain is soft but relentless. It reawakens dormant scalp bacteria and dramatically raises humidity — a perfect storm for frizz.',
            'Wash more often, but never with harsh cleansers. Follow every wash with a lightweight serum for a protective barrier.',
            'Carry a botanical mist for touch-ups on the go.',
        ].join('\n\n'),
    },
    {
        slug: 'understanding-your-hair-porosity', title: 'Understanding Your Hair Porosity',
        excerpt: 'Low, medium or high porosity — knowing yours changes everything about how you cleanse, condition and style.',
        category: 'Education', author: 'Devika Menon', publishedAt: '2026-03-05', image: img('prod-5.jpg'),
        content: [
            "Porosity refers to how well your hair absorbs and holds moisture. It's determined by the structure of the cuticle — the outermost layer of your strand.",
            'Low porosity hair repels moisture. Warm oils and steam help open the cuticle.',
            'High porosity hair drinks in moisture but loses it just as fast. Seal with a rich serum after every wash.',
        ].join('\n\n'),
    },
    {
        slug: 'the-ritual-of-champi', title: 'The Ritual of Champi — A Weekly Reset',
        excerpt: 'Fifteen minutes, a warm oil, and your fingertips. The oldest self-care ritual in the world is still the best.',
        category: 'Rituals', author: 'Meera Kapoor', publishedAt: '2026-02-18', image: img('prod-6.jpg'),
        content: [
            'Champi is more than a scalp massage — it is a meditation, a moment of stillness in an otherwise noisy week.',
            'Warm two tablespoons of Amla & Bhringraj oil. Section your hair. Massage in slow, deliberate circles from the crown outward.',
            'Leave overnight for deep nourishment; wash out with a gentle sulphate-free shampoo in the morning.',
        ].join('\n\n'),
    },
]

// backend layout: 'text-left' = text on the left (image order-2/right); 'text-right' = text on the right (image stays left)
// reference layout: 'image-left' = image left, text right  ->  backend 'text-right'
//                   'image-right' = image right, text left ->  backend 'text-left'
const ABOUT_SECTIONS = [
    {
        title: 'Rooted in Tradition', subtitle: 'Our Story',
        content: "Auraava was born in a small kitchen in Delhi, where three generations of women gathered every Sunday to brew hair oils the way their grandmothers had — with cold-pressed sesame, sun-warmed amla, and slow-infused bhringraj. When we couldn't find products that respected these rituals, we decided to make them ourselves.",
        image: img('cat-oils.png'), backgroundColor: '#FAF6F0', textColor: '#1C1008', layout: 'text-right' as const, order: 0,
    },
    {
        title: 'Ingredients With Integrity', subtitle: 'What We Believe',
        content: "Every ingredient in an Auraava bottle is traceable to its origin. We work directly with small-scale farmers across India — from Kerala's coconut groves to Rajasthan's rose fields — because provenance matters as much as purity. No parabens. No sulphates. No silicones. Ever.",
        image: img('cat-shampoo.png'), backgroundColor: '#F2EAE0', textColor: '#1C1008', layout: 'text-left' as const, order: 1,
    },
    {
        title: 'Kind to Hair, Kinder to the Planet', subtitle: 'Our Promise',
        content: 'Our bottles are recyclable glass, our cartons FSC-certified, and our formulations are 100% cruelty-free. We believe luxury and responsibility should never be at odds — beauty done well is beauty done kindly.',
        image: img('cat-serum.png'), backgroundColor: '#C8DDD0', textColor: '#1A3A2A', layout: 'text-right' as const, order: 2,
    },
    {
        title: 'A Ritual, Not a Routine', subtitle: 'The Auraava Way',
        content: "Hair care is not a chore to check off before bed. It's a quiet fifteen minutes of care that ripples through the rest of your week. Every Auraava product is designed to be slow, sensory and beautiful — because you deserve rituals that feel like you.",
        image: img('cat-spray.png'), backgroundColor: '#F5EDE4', textColor: '#1C1008', layout: 'text-left' as const, order: 3,
    },
]

async function seed() {
    await connectDB()

    await Product.deleteMany({})
    await Product.insertMany(PRODUCTS)
    console.log(`Seeded ${PRODUCTS.length} products`)

    await OffersData.deleteMany({})
    await OffersData.create({ sectionTitle: 'Exclusive Offers', sectionSubtitle: 'Hand-curated bundles and seasonal indulgences — for a fuller ritual.', isVisible: true, offers: OFFERS })
    console.log('Seeded offers')

    await Testimonial.deleteMany({})
    await Testimonial.insertMany(TESTIMONIALS)
    console.log(`Seeded ${TESTIMONIALS.length} testimonials`)

    await FAQ.deleteMany({})
    await FAQ.insertMany(FAQS)
    console.log(`Seeded ${FAQS.length} FAQs`)

    await HairCareData.deleteMany({})
    await HairCareData.create({ sectionTitle: 'Your Guide to Beautiful Hair', sectionDescription: 'Indulge in a self-care ritual that nurtures your hair from within — pure, effective, and powered by nature.', items: HAIRCARE_ITEMS })
    console.log('Seeded hair-care guide')

    await InstagramData.deleteMany({})
    await InstagramData.create({ sectionTitle: 'Follow us for daily hair care inspiration', sectionSubtitle: '@auraavacare', posts: INSTAGRAM_POSTS })
    console.log('Seeded instagram posts')

    await StatsData.deleteMany({})
    await StatsData.create({ items: STATS_ITEMS })
    console.log('Seeded stats')

    await Blog.deleteMany({})
    await Blog.insertMany(BLOGS)
    console.log(`Seeded ${BLOGS.length} blogs`)

    await AboutUsSection.deleteMany({})
    await AboutUsSection.insertMany(ABOUT_SECTIONS)
    console.log(`Seeded ${ABOUT_SECTIONS.length} about-us sections`)

    console.log('Seed complete.')
    process.exit(0)
}

seed().catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
})
