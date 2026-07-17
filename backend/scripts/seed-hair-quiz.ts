// Seeds the hair quiz questions from the F&Q's PDF, if the quiz has no
// questions yet. Run with: npm run seed:hair-quiz (from backend/)
import dotenv from 'dotenv'
dotenv.config()

import connectDB from '../lib/mongodb'
import HairQuizModel from '../lib/models/HairQuiz'

const QUESTIONS = [
    {
        question: 'What brings you here today?',
        options: [
            'Hair Fall',
            'Hair Growth',
            'Dandruff / Scalp Issues',
            'Dry & Damaged Hair',
            'Looking for the Right Product',
        ],
        order: 0,
    },
    {
        question: 'Which product are you interested in?',
        options: [
            'Ayurvedic Hair Oil',
            'Herbal Shampoo',
            'Pre-Wash Hair Spray',
            'Complete Hair Care Ritual',
            'Not Sure — Recommend One',
        ],
        order: 1,
    },
    {
        question: 'Tell us about your hair type.',
        options: [
            'Oily Scalp',
            'Dry Hair',
            'Normal Hair',
            'Curly / Wavy Hair',
            "I Don't Know",
        ],
        order: 2,
    },
    {
        question: 'Have you used Ayurvedic hair care before?',
        options: [
            'Yes, regularly',
            'Occasionally',
            'This will be my first time',
        ],
        order: 3,
    },
    {
        question: 'Would you like us to recommend a personalized hair care ritual?',
        options: [
            'Yes',
            'Maybe Later',
        ],
        order: 4,
    },
]

async function run() {
    await connectDB()

    const existing = await HairQuizModel.findOne()

    if (existing && existing.questions.length > 0) {
        console.log('Hair quiz already has questions, skipping seed.')
        process.exit(0)
    }

    await HairQuizModel.findOneAndUpdate(
        {},
        {
            $set: {
                title: 'Find Your Perfect Hair Ritual',
                subtitle: "Answer a few quick questions and we'll recommend the right products for you",
                questions: QUESTIONS,
            },
        },
        { upsert: true }
    )

    console.log('Hair quiz seeded with', QUESTIONS.length, 'questions.')
    process.exit(0)
}

run().catch((error) => {
    console.error('Error seeding hair quiz:', error)
    process.exit(1)
})
