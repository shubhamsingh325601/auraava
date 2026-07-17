import mongoose, { Schema, Document } from 'mongoose'

export interface IQuizAnswer {
    question: string
    answer: string
}

export interface IQuizResponse extends Document {
    name: string
    email: string
    phone: string
    answers: IQuizAnswer[]
    createdAt: string
}

const QuizAnswerSchema = new Schema<IQuizAnswer>({
    question: { type: String, required: true },
    answer: { type: String, required: true }
}, { _id: false })

const QuizResponseSchema = new Schema<IQuizResponse>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    answers: { type: [QuizAnswerSchema], default: [] },
    createdAt: { type: String, default: () => new Date().toISOString() }
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

export default mongoose.models.QuizResponse || mongoose.model<IQuizResponse>('QuizResponse', QuizResponseSchema)
