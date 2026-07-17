import connectDB from './mongodb'
import HairQuizModel, { IHairQuiz } from './models/HairQuiz'
import QuizResponseModel from './models/QuizResponse'

export interface QuizQuestion {
    id: string
    question: string
    options: string[]
    order: number
}

export interface HairQuizConfig {
    title: string
    subtitle: string
    questions: QuizQuestion[]
}

export interface QuizAnswer {
    question: string
    answer: string
}

export interface QuizResponse {
    id: string
    name: string
    email: string
    phone: string
    answers: QuizAnswer[]
    createdAt: string
}

async function getOrCreateQuiz(): Promise<IHairQuiz> {
    await connectDB()
    let quiz = await HairQuizModel.findOne().lean()

    if (!quiz) {
        const newQuiz = new HairQuizModel({
            title: 'Find Your Perfect Hair Ritual',
            subtitle: "Answer a few quick questions and we'll recommend the right products for you",
            questions: []
        })
        const saved = await newQuiz.save()
        quiz = saved.toObject() as any
    }

    return quiz as any as IHairQuiz
}

export async function getHairQuiz(): Promise<HairQuizConfig> {
    try {
        const quiz = await getOrCreateQuiz()
        const questions = (quiz.questions || []).sort((a: any, b: any) => a.order - b.order)
        return {
            title: quiz.title || 'Find Your Perfect Hair Ritual',
            subtitle: quiz.subtitle || "Answer a few quick questions and we'll recommend the right products for you",
            questions: questions.map((q: any) => ({
                ...q,
                id: q._id ? q._id.toString() : q.id
            }))
        }
    } catch (error) {
        console.error('Error reading hair quiz:', error)
        return {
            title: 'Find Your Perfect Hair Ritual',
            subtitle: "Answer a few quick questions and we'll recommend the right products for you",
            questions: []
        }
    }
}

export async function getQuizQuestionById(id: string): Promise<QuizQuestion | null> {
    try {
        const quiz = await getHairQuiz()
        return quiz.questions.find(q => q.id === id) || null
    } catch (error) {
        console.error('Error reading quiz question:', error)
        return null
    }
}

export async function updateQuizSection(updates: Partial<Pick<HairQuizConfig, 'title' | 'subtitle'>>): Promise<HairQuizConfig> {
    try {
        await getOrCreateQuiz()
        await HairQuizModel.findOneAndUpdate({}, { $set: updates }, { upsert: true })
        return await getHairQuiz()
    } catch (error) {
        console.error('Error updating hair quiz section:', error)
        throw error
    }
}

export async function addQuizQuestion(question: Omit<QuizQuestion, 'id'>): Promise<QuizQuestion> {
    try {
        const quiz = await getOrCreateQuiz()
        quiz.questions.push(question as any)
        await HairQuizModel.findOneAndUpdate({}, { $set: { questions: quiz.questions } }, { upsert: true })
        const updated = await getHairQuiz()
        return updated.questions[updated.questions.length - 1]
    } catch (error) {
        console.error('Error adding quiz question:', error)
        throw error
    }
}

export async function updateQuizQuestion(id: string, updates: Partial<QuizQuestion>): Promise<QuizQuestion | null> {
    try {
        const quiz = await getOrCreateQuiz()
        const idx = quiz.questions.findIndex((q: any) => (q._id ? q._id.toString() : q.id) === id)

        if (idx === -1) return null

        const { id: _, ...updateData } = updates
        quiz.questions[idx] = { ...quiz.questions[idx], ...updateData } as any

        await HairQuizModel.findOneAndUpdate({}, { $set: { questions: quiz.questions } }, { upsert: true })

        const updated = await getHairQuiz()
        return updated.questions.find(q => q.id === id) || null
    } catch (error) {
        console.error('Error updating quiz question:', error)
        return null
    }
}

export async function deleteQuizQuestion(id: string): Promise<boolean> {
    try {
        const quiz = await getOrCreateQuiz()
        quiz.questions = quiz.questions.filter((q: any) => (q._id ? q._id.toString() : q.id) !== id) as any
        await HairQuizModel.findOneAndUpdate({}, { $set: { questions: quiz.questions } }, { upsert: true })
        return true
    } catch (error) {
        console.error('Error deleting quiz question:', error)
        return false
    }
}

export async function submitQuizResponse(data: { name: string; email: string; phone: string; answers: QuizAnswer[] }): Promise<QuizResponse> {
    await connectDB()
    const response = new QuizResponseModel(data)
    const saved = await response.save()
    return {
        ...saved.toObject(),
        id: saved._id.toString()
    } as any as QuizResponse
}

export async function getQuizResponses(): Promise<QuizResponse[]> {
    try {
        await connectDB()
        const responses = await QuizResponseModel.find({}).sort({ createdAt: -1 }).lean()
        return responses.map((r: any) => ({
            ...r,
            id: r._id.toString()
        })) as QuizResponse[]
    } catch (error) {
        console.error('Error reading quiz responses:', error)
        return []
    }
}

export async function getQuizResponseById(id: string): Promise<QuizResponse | null> {
    try {
        await connectDB()
        const response = await QuizResponseModel.findById(id).lean()
        if (!response) return null
        return { ...(response as any), id: (response as any)._id.toString() } as QuizResponse
    } catch (error) {
        console.error('Error reading quiz response:', error)
        return null
    }
}

export async function deleteQuizResponse(id: string): Promise<boolean> {
    try {
        await connectDB()
        const result = await QuizResponseModel.findByIdAndDelete(id)
        return result !== null
    } catch (error) {
        console.error('Error deleting quiz response:', error)
        return false
    }
}
