"use client"

import { adminFetch } from "@/lib/admin-fetch"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/auth/protected-route"
import { AdminPageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { MessageSquare, Trash2, Loader2, ChevronDown, ChevronUp } from "lucide-react"

interface QuizAnswer {
    question: string
    answer: string
}

interface QuizResponse {
    id: string
    name: string
    email: string
    phone: string
    answers: QuizAnswer[]
    createdAt: string
}

export default function AdminHairQuizResponsesPage() {
    const [responses, setResponses] = useState<QuizResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedId, setExpandedId] = useState<string | null>(null)

    useEffect(() => {
        fetchResponses()
    }, [])

    const fetchResponses = async () => {
        try {
            const res = await adminFetch('/api/hair-quiz/responses')
            const data = await res.json()
            setResponses(data.responses || [])
        } catch (error) {
            console.error('Failed to fetch quiz responses:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this response?')) return

        try {
            const res = await adminFetch(`/api/hair-quiz/responses/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setResponses(prev => prev.filter(r => r.id !== id))
            } else {
                alert('Failed to delete response')
            }
        } catch (error) {
            console.error('Failed to delete response:', error)
            alert('Failed to delete response')
        }
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-ivory">
                <AdminPageHeader
                    icon={MessageSquare}
                    eyebrow="Hair Quiz"
                    title={`Quiz Responses${loading ? '' : ` (${responses.length})`}`}
                    backHref="/admin/hair-quiz"
                    backLabel="Back to Hair Quiz"
                />

                <main className="container-x py-10">
                    <div className="bg-cream rounded-2xl shadow-card p-6">
                        {loading ? (
                            <div className="flex items-center justify-center gap-3 text-muted-foreground py-12">
                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                <span>Loading responses...</span>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {responses.map((r) => {
                                    const expanded = expandedId === r.id
                                    return (
                                        <div key={r.id} className="bg-white border border-border rounded-xl overflow-hidden">
                                            <div
                                                className="flex items-center justify-between p-4 cursor-pointer"
                                                onClick={() => setExpandedId(expanded ? null : r.id)}
                                            >
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-foreground truncate">{r.name}</p>
                                                    <p className="text-sm text-muted-foreground truncate">{r.email} · {r.phone}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {new Date(r.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <Button
                                                        size="sm"
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(r.id) }}
                                                        className="rounded-full border border-destructive/30 bg-white hover:bg-destructive/10 text-destructive"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                    {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                                </div>
                                            </div>
                                            {expanded && (
                                                <div className="border-t border-border p-4 space-y-2 bg-ivory/60">
                                                    {r.answers.map((a, i) => (
                                                        <div key={i}>
                                                            <p className="text-xs uppercase tracking-wider font-semibold text-primary">{a.question}</p>
                                                            <p className="text-sm text-foreground">{a.answer || '—'}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                                {responses.length === 0 && (
                                    <p className="text-muted-foreground text-center py-4">No quiz responses yet</p>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    )
}
