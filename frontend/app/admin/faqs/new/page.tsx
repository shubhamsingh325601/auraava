"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminPageHeader } from "@/components/admin/page-header"

export default function NewFAQPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        order: 1,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/faqs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                router.push('/admin')
            } else {
                alert('Failed to create FAQ')
            }
        } catch (error) {
            console.error('Failed to create FAQ:', error)
            alert('Failed to create FAQ')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-ivory">
            <AdminPageHeader icon={HelpCircle} eyebrow="FAQs" title="Add New FAQ" backHref="/admin/faqs" />

            <main className="container-x py-10 max-w-3xl">
                <form onSubmit={handleSubmit} className="bg-cream rounded-2xl shadow-card p-6 space-y-6">
                    {/* Question */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Question *</label>
                        <input
                            type="text"
                            required
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                            placeholder="e.g., Are your products suitable for all hair types?"
                        />
                    </div>

                    {/* Answer */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Answer *</label>
                        <textarea
                            required
                            value={formData.answer}
                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                            rows={5}
                            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                            placeholder="Provide a detailed answer..."
                        />
                    </div>

                    {/* Order */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Display Order</label>
                        <input
                            type="number"
                            min="1"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                            placeholder="1"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                            Lower numbers appear first
                        </p>
                    </div>

                    {/* Preview */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Preview</label>
                        <div className="bg-white border border-border rounded-xl overflow-hidden">
                            <div className="p-4 border-b border-border">
                                <p className="font-semibold text-foreground">
                                    {formData.question || "Your question will appear here..."}
                                </p>
                            </div>
                            <div className="p-4">
                                <p className="text-muted-foreground">
                                    {formData.answer || "Your answer will appear here..."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-full bg-primary hover:bg-primary-light text-primary-foreground h-11 text-[11px] uppercase tracking-[0.16em] font-semibold"
                        >
                            {loading ? 'Creating...' : 'Create FAQ'}
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

