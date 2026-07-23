"use client"

import { adminFetch } from "@/lib/admin-fetch"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, ClipboardList, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminPageHeader } from "@/components/admin/page-header"

export default function EditHairQuizQuestionPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        question: "",
        options: ["", ""],
        order: 1,
    })

    useEffect(() => {
        fetchQuestion()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchQuestion = async () => {
        try {
            const res = await adminFetch(`/api/hair-quiz/${params.id}`)
            const data = await res.json()
            if (data.question) {
                setFormData({
                    question: data.question.question,
                    options: data.question.options.length ? data.question.options : ["", ""],
                    order: data.question.order,
                })
            }
        } catch (error) {
            console.error('Failed to fetch quiz question:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const options = formData.options.map(o => o.trim()).filter(Boolean)
            const res = await adminFetch(`/api/hair-quiz/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, options }),
            })

            if (res.ok) {
                router.push('/admin/hair-quiz')
            } else {
                alert('Failed to update question')
            }
        } catch (error) {
            console.error('Failed to update question:', error)
            alert('Failed to update question')
        } finally {
            setSaving(false)
        }
    }

    const validOptionCount = formData.options.map(o => o.trim()).filter(Boolean).length

    if (loading) {
        return (
            <div className="min-h-screen bg-ivory flex items-center justify-center">
                <div className="flex items-center justify-center gap-3 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin text-primary" /><span>Loading...</span></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-ivory">
            <AdminPageHeader icon={ClipboardList} eyebrow="Hair Quiz" title="Edit Question" backHref="/admin/hair-quiz" />

            <main className="container-x py-10 max-w-3xl">
                <form onSubmit={handleSubmit} className="bg-cream rounded-2xl shadow-card p-8 space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Question *</label>
                        <input
                            type="text"
                            required
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Order *</label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                            Lower numbers appear first
                        </p>
                    </div>

                    <div className="bg-white border border-border rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-xs uppercase tracking-wider font-semibold text-primary">Answer Options *</label>
                            <Button
                                type="button"
                                size="sm"
                                className="rounded-full border border-border bg-white hover:bg-cream text-foreground text-[11px] uppercase tracking-[0.14em] font-semibold"
                                onClick={() => setFormData(prev => ({ ...prev, options: [...prev.options, ""] }))}
                            >
                                Add Option
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {formData.options.map((option, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground w-5 shrink-0">{index + 1})</span>
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => {
                                            const next = [...formData.options]
                                            next[index] = e.target.value
                                            setFormData({ ...formData, options: next })
                                        }}
                                        placeholder="Option text"
                                        className="flex-1 bg-ivory/60 border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                    />
                                    <Button
                                        type="button"
                                        size="sm"
                                        className="rounded-full border border-destructive/30 bg-white hover:bg-destructive/10 text-destructive"
                                        onClick={() => setFormData(prev => ({ ...prev, options: prev.options.filter((_, i) => i !== index) }))}
                                        disabled={formData.options.length === 2}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-3">At least 2 options required. Empty options are ignored.</p>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={saving || !formData.question || validOptionCount < 2}
                            className="flex-1 rounded-full bg-primary hover:bg-primary-light text-primary-foreground h-11 text-[11px] uppercase tracking-[0.16em] font-semibold"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Link href="/admin/hair-quiz" className="flex-1">
                            <Button type="button" className="w-full rounded-full border border-border bg-white hover:bg-cream text-foreground h-11 text-[11px] uppercase tracking-[0.16em] font-semibold">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </main>
        </div>
    )
}
