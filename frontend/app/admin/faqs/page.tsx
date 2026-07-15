"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import ProtectedRoute from "@/components/auth/protected-route"
import { AdminPageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { HelpCircle, Plus, Trash2, Loader2 } from "lucide-react"

interface FAQ {
    id: string
    question: string
    answer: string
    order: number
}

export default function AdminFAQsPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFaqs()
    }, [])

    const fetchFaqs = async () => {
        try {
            const res = await fetch('/api/faqs')
            const data = await res.json()
            setFaqs(data.faqs || [])
        } catch (error) {
            console.error('Failed to fetch FAQs:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this FAQ?')) return

        try {
            const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setFaqs(prev => prev.filter(f => f.id !== id))
            } else {
                alert('Failed to delete FAQ')
            }
        } catch (error) {
            console.error('Failed to delete FAQ:', error)
            alert('Failed to delete FAQ')
        }
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-ivory">
                <AdminPageHeader
                    icon={HelpCircle}
                    eyebrow="Support"
                    title={`FAQs${loading ? '' : ` (${faqs.length})`}`}
                    actions={
                        <Link href="/admin/faqs/new">
                            <Button className="rounded-full bg-primary hover:bg-primary-light text-primary-foreground flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] font-semibold">
                                <Plus className="w-4 h-4" />
                                Add FAQ
                            </Button>
                        </Link>
                    }
                />

                <main className="container-x py-10">
                    <div className="bg-cream rounded-2xl shadow-card p-6">
                        {loading ? (
                            <div className="flex items-center justify-center gap-3 text-muted-foreground py-12">
                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                <span>Loading FAQs...</span>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {faqs.map((faq) => (
                                    <div key={faq.id} className="flex items-center justify-between p-4 bg-white border border-border rounded-xl">
                                        <div>
                                            <p className="font-semibold text-foreground">{faq.question}</p>
                                            <p className="text-sm text-muted-foreground">Order: {faq.order}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => handleDelete(faq.id)}
                                                className="rounded-full border border-destructive/30 bg-white hover:bg-destructive/10 text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {faqs.length === 0 && (
                                    <p className="text-muted-foreground text-center py-4">No FAQs yet</p>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    )
}
