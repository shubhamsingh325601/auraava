import mongoose, { Schema, Document } from 'mongoose'

export interface IQuizQuestion {
    question: string
    options: string[]
    order: number
}

export interface IHairQuiz extends Document {
    title: string
    subtitle: string
    questions: IQuizQuestion[]
}

const QuizQuestionSchema = new Schema<IQuizQuestion>({
    question: { type: String, required: true },
    options: { type: [String], required: true },
    order: { type: Number, default: 0 }
}, {
    timestamps: false,
    toJSON: {
        transform: function (doc, ret: any) {
            ret.id = ret._id.toString()
            delete ret._id
            delete ret.__v
            return ret
        }
    }
})

const HairQuizSchema = new Schema<IHairQuiz>({
    title: { type: String, default: 'Find Your Perfect Hair Ritual' },
    subtitle: { type: String, default: "Answer a few quick questions and we'll recommend the right products for you" },
    questions: { type: [QuizQuestionSchema], default: [] }
}, {
    timestamps: false,
    toJSON: {
        transform: function (doc, ret: any) {
            ret.id = ret._id.toString()
            delete ret._id
            delete ret.__v
            return ret
        }
    }
})

export default mongoose.models.HairQuiz || mongoose.model<IHairQuiz>('HairQuiz', HairQuizSchema)
