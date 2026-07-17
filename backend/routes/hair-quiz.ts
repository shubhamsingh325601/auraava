import express, { Request, Response } from 'express'
import { requireAdmin } from '../middleware/requireAdmin'
import {
    getHairQuiz,
    updateQuizSection,
    addQuizQuestion,
    getQuizQuestionById,
    updateQuizQuestion,
    deleteQuizQuestion,
    submitQuizResponse,
    getQuizResponses,
    getQuizResponseById,
    deleteQuizResponse,
} from '../lib/hair-quiz'

const router = express.Router()

// GET /api/hair-quiz
router.get('/', async (req: Request, res: Response) => {
    try {
        const quiz = await getHairQuiz()
        res.json({ ...quiz })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hair quiz' })
    }
})

// GET /api/hair-quiz/responses
// Must be declared before the /:id route below, otherwise Express would
// match "responses" as a question id.
router.get('/responses', requireAdmin, async (req: Request, res: Response) => {
    try {
        const responses = await getQuizResponses()
        res.json({ responses })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch quiz responses' })
    }
})

// GET /api/hair-quiz/responses/:id
router.get('/responses/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const response = await getQuizResponseById(req.params.id)
        if (!response) {
            return res.status(404).json({ error: 'Quiz response not found' })
        }
        res.json({ response })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch quiz response' })
    }
})

// DELETE /api/hair-quiz/responses/:id
router.delete('/responses/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const success = await deleteQuizResponse(req.params.id)
        if (!success) {
            return res.status(404).json({ error: 'Quiz response not found' })
        }
        res.json({ message: 'Quiz response deleted' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete quiz response' })
    }
})

// POST /api/hair-quiz/responses
router.post('/responses', async (req: Request, res: Response) => {
    try {
        const { name, email, phone, answers } = req.body

        if (!name || !email || !phone || !Array.isArray(answers)) {
            return res.status(400).json({ error: 'Name, email, phone and answers are required' })
        }

        const response = await submitQuizResponse({ name, email, phone, answers })
        res.status(201).json({ response })
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit quiz response' })
    }
})

// GET /api/hair-quiz/:id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const question = await getQuizQuestionById(req.params.id)
        if (!question) {
            return res.status(404).json({ error: 'Question not found' })
        }
        res.json({ question })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch question' })
    }
})

// POST /api/hair-quiz
router.post('/', requireAdmin, async (req: Request, res: Response) => {
    try {
        const body = req.body

        // Check if updating section metadata
        if (body.title !== undefined || body.subtitle !== undefined) {
            const updated = await updateQuizSection({
                title: body.title,
                subtitle: body.subtitle
            })
            return res.json({ ...updated })
        }

        // Otherwise, add a new question
        const newQuestion = await addQuizQuestion(body)
        return res.status(201).json({ question: newQuestion })
    } catch (error) {
        res.status(500).json({ error: 'Failed to create question' })
    }
})

// PUT /api/hair-quiz/:id
router.put('/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const updatedQuestion = await updateQuizQuestion(req.params.id, req.body)
        if (!updatedQuestion) {
            return res.status(404).json({ error: 'Question not found' })
        }
        res.json({ question: updatedQuestion })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update question' })
    }
})

// DELETE /api/hair-quiz/:id
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        const success = await deleteQuizQuestion(req.params.id)
        if (!success) {
            return res.status(404).json({ error: 'Question not found' })
        }
        res.json({ message: 'Question deleted' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete question' })
    }
})

export default router
