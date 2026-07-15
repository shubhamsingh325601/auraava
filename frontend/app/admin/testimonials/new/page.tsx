"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminPageHeader } from "@/components/admin/page-header"

export default function NewTestimonialPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        text: "",
        author: "",
        rating: 5,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/testimonials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                router.push('/admin')
            } else {
                alert('Failed to create testimonial')
            }
        } catch (error) {
            console.error('Failed to create testimonial:', error)
            alert('Failed to create testimonial')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-ivory">
            <AdminPageHeader icon={Star} eyebrow="Testimonials" title="Add New Testimonial" backHref="/admin/testimonials" />

            <main className="container-x py-10 max-w-3xl">
                <form onSubmit={handleSubmit} className="bg-cream rounded-2xl shadow-card p-6 space-y-6">
                    {/* Testimonial Text */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Testimonial Text *</label>
                        <textarea
                            required
                            value={formData.text}
                            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                            rows={5}
                            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                            placeholder="Write the customer's review..."
                        />
                    </div>

                    {/* Author */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Author Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                            placeholder="e.g., Sarah M."
                        />
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Rating *</label>
                        <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-4 py-3">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rating })}
                                    className="p-1 hover:scale-110 transition-transform"
                                >
                                    <Star
                                        className={`w-8 h-8 ${rating <= formData.rating
                                            ? "fill-rating-star text-rating-star"
                                            : "text-muted-foreground"
                                            }`}
                                    />
                                </button>
                            ))}
                            <span className="ml-4 self-center text-lg font-semibold text-foreground">
                                {formData.rating} / 5
                            </span>
                        </div>
                    </div>

                    {/* Preview */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Preview</label>
                        <div className="bg-white border border-border rounded-xl p-6">
                            <p className="italic text-foreground mb-4">
                                &ldquo;{formData.text || "Your testimonial text will appear here..."}&rdquo;
                            </p>
                            <div className="flex items-center justify-center gap-1 mb-2">
                                {[...Array(formData.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-rating-star text-rating-star" />
                                ))}
                            </div>
                            <p className="text-center font-semibold text-foreground">
                                {formData.author || "Author Name"}
                            </p>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-full bg-primary hover:bg-primary-light text-primary-foreground h-11 text-[11px] uppercase tracking-[0.16em] font-semibold"
                        >
                            {loading ? 'Creating...' : 'Create Testimonial'}
                        </Button>
                        <Link href="/admin" className="flex-1">
                            <Button type="button" variant="outline" className="w-full rounded-full border border-border bg-white hover:bg-cream text-foreground h-11 text-[11px] uppercase tracking-[0.16em] font-semibold">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </main>
        </div>
    )
}

