"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import ProtectedRoute from "@/components/auth/protected-route"
import { AdminPageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Star, Plus, Trash2, Loader2 } from "lucide-react"

interface Testimonial {
    id: string
    author: string
    rating: number
    text: string
}

export default function AdminTestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTestimonials()
    }, [])

    const fetchTestimonials = async () => {
        try {
            const res = await fetch('/api/testimonials')
            const data = await res.json()
            setTestimonials(data.testimonials || [])
        } catch (error) {
            console.error('Failed to fetch testimonials:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return

        try {
            const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setTestimonials(prev => prev.filter(t => t.id !== id))
            } else {
                alert('Failed to delete testimonial')
            }
        } catch (error) {
            console.error('Failed to delete testimonial:', error)
            alert('Failed to delete testimonial')
        }
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-ivory">
                <AdminPageHeader
                    icon={Star}
                    eyebrow="Social Proof"
                    title={`Testimonials${loading ? '' : ` (${testimonials.length})`}`}
                    actions={
                        <Link href="/admin/testimonials/new">
                            <Button className="rounded-full bg-primary hover:bg-primary-light text-primary-foreground flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] font-semibold">
                                <Plus className="w-4 h-4" />
                                Add Testimonial
                            </Button>
                        </Link>
                    }
                />

                <main className="container-x py-10">
                    <div className="bg-cream rounded-2xl shadow-card p-6">
                        {loading ? (
                            <div className="flex items-center justify-center gap-3 text-muted-foreground py-12">
                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                <span>Loading testimonials...</span>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {testimonials.map((testimonial) => (
                                    <div key={testimonial.id} className="flex items-center justify-between p-4 bg-white border border-border rounded-xl">
                                        <div>
                                            <p className="font-semibold text-foreground">{testimonial.author}</p>
                                            <p className="text-sm text-rating-star mt-0.5">
                                                {'⭐'.repeat(testimonial.rating)}
                                            </p>
                                            {testimonial.text && (
                                                <p className="text-sm text-muted-foreground mt-1 max-w-xl italic">&ldquo;{testimonial.text}&rdquo;</p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => handleDelete(testimonial.id)}
                                                className="rounded-full border border-destructive/30 bg-white hover:bg-destructive/10 text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {testimonials.length === 0 && (
                                    <p className="text-muted-foreground text-center py-4">No testimonials yet</p>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    )
}
