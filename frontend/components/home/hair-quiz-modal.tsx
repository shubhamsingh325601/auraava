"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { X, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const STORAGE_KEY = "auraava_hair_quiz_seen"

interface QuizQuestion {
    id: string
    question: string
    options: string[]
    order: number
}

interface QuizConfig {
    title: string
    subtitle: string
    questions: QuizQuestion[]
}

export default function HairQuizModal() {
    const pathname = usePathname()

    const [open, setOpen] = useState(false)
    const [quiz, setQuiz] = useState<QuizConfig | null>(null)
    const [step, setStep] = useState(0)
    const [selections, setSelections] = useState<Record<string, string>>({})
    const [contact, setContact] = useState({ name: "", email: "", phone: "" })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (pathname?.startsWith("/admin")) return
        if (typeof window === "undefined") return
        if (localStorage.getItem(STORAGE_KEY)) return

        fetch('/api/hair-quiz')
            .then(res => res.json())
            .then(data => {
                if (data.questions?.length) {
                    setQuiz(data)
                    setOpen(true)
                }
            })
            .catch(() => { })
        // Only ever needs to run once on initial mount for a fresh visitor.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (pathname?.startsWith("/admin") || !open || !quiz) return null

    const totalSteps = quiz.questions.length + 1
    const isContactStep = step === quiz.questions.length
    const currentQuestion = !isContactStep ? quiz.questions[step] : null

    const dismiss = () => {
        localStorage.setItem(STORAGE_KEY, "1")
        setOpen(false)
    }

    const selectOption = (option: string) => {
        if (!currentQuestion) return
        setSelections(prev => ({ ...prev, [currentQuestion.id]: option }))
    }

    const goNext = () => {
        if (step < totalSteps - 1) setStep(step + 1)
    }

    const goBack = () => {
        if (step > 0) setStep(step - 1)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const answers = quiz.questions.map(q => ({
                question: q.question,
                answer: selections[q.id] || "",
            }))

            const res = await fetch('/api/hair-quiz/responses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...contact, answers }),
            })

            if (res.ok) {
                localStorage.setItem(STORAGE_KEY, "1")
                setOpen(false)
                window.location.href = '/'
            } else {
                alert('Failed to submit. Please try again.')
            }
        } catch (error) {
            console.error('Failed to submit hair quiz:', error)
            alert('Failed to submit. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
            <div className="relative w-full max-w-lg bg-cream rounded-2xl shadow-hover p-8 max-h-[90vh] overflow-y-auto">
                <button
                    type="button"
                    onClick={dismiss}
                    aria-label="Close"
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-5 h-5 text-accent-gold" />
                    <p className="eyebrow text-accent-gold">Hair Quiz</p>
                </div>
                <h2 className="text-2xl font-display font-bold text-primary mb-1 pr-8">{quiz.title}</h2>
                <p className="text-sm text-muted-foreground mb-6">{quiz.subtitle}</p>

                <div className="flex gap-1 mb-6">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-border'}`} />
                    ))}
                </div>

                {!isContactStep && currentQuestion && (
                    <div className="space-y-6">
                        <p className="font-semibold text-foreground">{currentQuestion.question}</p>
                        <div className="space-y-2">
                            {currentQuestion.options.map(option => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => selectOption(option)}
                                    className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${selections[currentQuestion.id] === option
                                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                                        : 'border-border bg-white hover:bg-cream'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-3 pt-2">
                            {step > 0 && (
                                <Button
                                    type="button"
                                    onClick={goBack}
                                    className="flex-1 rounded-full border border-border bg-white hover:bg-cream text-foreground h-11 text-[11px] uppercase tracking-[0.16em] font-semibold"
                                >
                                    Back
                                </Button>
                            )}
                            <Button
                                type="button"
                                onClick={goNext}
                                disabled={!selections[currentQuestion.id]}
                                className="flex-1 rounded-full bg-primary hover:bg-primary-light text-primary-foreground h-11 text-[11px] uppercase tracking-[0.16em] font-semibold"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                {isContactStep && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <p className="font-semibold text-foreground">Almost done! Where should we send your recommendation?</p>
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Name *</label>
                            <input
                                type="text"
                                required
                                value={contact.name}
                                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Email *</label>
                            <input
                                type="email"
                                required
                                value={contact.email}
                                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Phone Number *</label>
                            <input
                                type="tel"
                                required
                                value={contact.phone}
                                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                onClick={goBack}
                                className="flex-1 rounded-full border border-border bg-white hover:bg-cream text-foreground h-11 text-[11px] uppercase tracking-[0.16em] font-semibold"
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 rounded-full bg-primary hover:bg-primary-light text-primary-foreground h-11 text-[11px] uppercase tracking-[0.16em] font-semibold"
                            >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Submit'}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
