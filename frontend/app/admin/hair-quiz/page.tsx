"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import ProtectedRoute from "@/components/auth/protected-route"
import { AdminPageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { ClipboardList, Plus, Edit, Trash2, Loader2, MessageSquare, Save } from "lucide-react"

interface QuizQuestion {
    id: string
    question: string
    options: string[]
    order: number
}

export default function AdminHairQuizPage() {
    const [questions, setQuestions] = useState<QuizQuestion[]>([])
    const [title, setTitle] = useState("")
    const [subtitle, setSubtitle] = useState("")
    const [loading, setLoading] = useState(true)
    const [savingSection, setSavingSection] = useState(false)

    useEffect(() => {
        fetchQuiz()
    }, [])

    const fetchQuiz = async () => {
        try {
            const res = await fetch('/api/hair-quiz')
            const data = await res.json()
            setQuestions(data.questions || [])
            setTitle(data.title || "")
            setSubtitle(data.subtitle || "")
        } catch (error) {
            console.error('Failed to fetch hair quiz:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSaveSection = async () => {
        setSavingSection(true)
        try {
            const res = await fetch('/api/hair-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, subtitle }),
            })
            if (!res.ok) {
                alert('Failed to save quiz heading')
            }
        } catch (error) {
            console.error('Failed to save quiz heading:', error)
            alert('Failed to save quiz heading')
        } finally {
            setSavingSection(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this question?')) return

        try {
            const res = await fetch(`/api/hair-quiz/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setQuestions(prev => prev.filter(q => q.id !== id))
            } else {
                alert('Failed to delete question')
            }
        } catch (error) {
            console.error('Failed to delete question:', error)
            alert('Failed to delete question')
        }
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-ivory">
                <AdminPageHeader
                    icon={ClipboardList}
                    eyebrow="Home Page"
                    title={`Hair Quiz${loading ? '' : ` (${questions.length})`}`}
                    actions={
                        <>
                            <Link href="/admin/hair-quiz/responses">
                                <Button className="rounded-full border border-border bg-white hover:bg-cream text-foreground flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] font-semibold">
                                    <MessageSquare className="w-4 h-4" />
                                    Responses
                                </Button>
                            </Link>
                            <Link href="/admin/hair-quiz/new">
                                <Button className="rounded-full bg-primary hover:bg-primary-light text-primary-foreground flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] font-semibold">
                                    <Plus className="w-4 h-4" />
                                    Add Question
                                </Button>
                            </Link>
                        </>
                    }
                />

                <main className="container-x py-10 space-y-6">
                    <div className="bg-cream rounded-2xl shadow-card p-6">
                        <h2 className="text-xs uppercase tracking-wider font-semibold text-primary mb-4">Quiz Heading</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Subtitle</label>
                                <input
                                    type="text"
                                    value={subtitle}
                                    onChange={(e) => setSubtitle(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                />
                            </div>
                            <Button
                                onClick={handleSaveSection}
                                disabled={savingSection}
                                className="rounded-full bg-primary hover:bg-primary-light text-primary-foreground flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] font-semibold"
                            >
                                <Save className="w-4 h-4" />
                                {savingSection ? 'Saving...' : 'Save Heading'}
                            </Button>
                        </div>
                    </div>

                    <div className="bg-cream rounded-2xl shadow-card p-6">
                        {loading ? (
                            <div className="flex items-center justify-center gap-3 text-muted-foreground py-12">
                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                <span>Loading questions...</span>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {questions.map((q) => (
                                    <div key={q.id} className="flex items-center justify-between p-4 bg-white border border-border rounded-xl">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-foreground truncate">{q.question}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Order: {q.order} · {q.options.length} options
                                            </p>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <Link href={`/admin/hair-quiz/${q.id}`}>
                                                <Button size="sm" className="rounded-full border border-border bg-white hover:bg-cream text-foreground">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                onClick={() => handleDelete(q.id)}
                                                className="rounded-full border border-destructive/30 bg-white hover:bg-destructive/10 text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {questions.length === 0 && (
                                    <p className="text-muted-foreground text-center py-4">No quiz questions yet</p>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    )
}
