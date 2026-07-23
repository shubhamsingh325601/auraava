"use client"

import { adminFetch } from "@/lib/admin-fetch"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Upload, X, Newspaper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminPageHeader } from "@/components/admin/page-header"
import { uploadImage } from "@/lib/upload-image"

export default function NewBlogPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        author: "Auraava Team",
        category: "Hair Care",
        image: "",
        publishedAt: new Date().toISOString().split('T')[0],
    })

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingImage(true)
        try {
            const url = await uploadImage(file)
            if (url) {
                setFormData(prev => ({
                    ...prev,
                    image: url
                }))
            } else {
                alert('Failed to upload image')
            }
        } catch (error) {
            console.error('Failed to upload image:', error)
            alert('Failed to upload image')
        } finally {
            setUploadingImage(false)
        }
    }

    const handleTitleChange = (title: string) => {
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
        setFormData({ ...formData, title, slug })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await adminFetch('/api/blogs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                router.push('/admin')
            } else {
                alert('Failed to create blog post')
            }
        } catch (error) {
            console.error('Failed to create blog post:', error)
            alert('Failed to create blog post')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-ivory">
            <AdminPageHeader icon={Newspaper} eyebrow="Blogs" title="Add New Blog Post" />

            <main className="container-x py-10 max-w-4xl">
                <form onSubmit={handleSubmit} className="bg-cream rounded-2xl shadow-card p-8 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Title *</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                            placeholder="e.g., 5 Essential Hair Care Tips"
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Slug (URL) *</label>
                        <input
                            type="text"
                            required
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                            placeholder="5-essential-hair-care-tips"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                            Auto-generated from title. Can be edited.
                        </p>
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Excerpt *</label>
                        <textarea
                            required
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                            placeholder="A brief summary of your blog post..."
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Content *</label>
                        <textarea
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows={15}
                            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all font-mono text-sm"
                            placeholder="Write your blog content here... (supports basic markdown)"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                            Use ** for bold text. Separate paragraphs with double line breaks.
                        </p>
                    </div>

                    {/* Author & Category */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Author *</label>
                            <input
                                type="text"
                                required
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Category *</label>
                            <input
                                type="text"
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                placeholder="e.g., Hair Care, Natural Ingredients"
                            />
                        </div>
                    </div>

                    {/* Published Date */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Published Date *</label>
                        <input
                            type="date"
                            required
                            value={formData.publishedAt}
                            onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Featured Image */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Featured Image *</label>
                        <div className="space-y-4">
                            {formData.image && (
                                <div className="relative w-full h-64 rounded-xl overflow-hidden border border-border">
                                    <img src={formData.image} alt="Featured" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, image: "" })}
                                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full p-2 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            <label className="inline-block">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={uploadingImage}
                                />
                                <span className="inline-flex items-center px-4 py-3 bg-white border border-border rounded-lg cursor-pointer hover:bg-cream transition-colors text-sm font-medium text-foreground">
                                    <Upload className="w-4 h-4 mr-2" />
                                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4 pt-4 border-t border-border">
                        <Button
                            type="submit"
                            disabled={loading || !formData.image}
                            className="flex-1 rounded-full bg-primary hover:bg-primary-light text-primary-foreground h-11 text-[11px] uppercase tracking-[0.16em] font-semibold py-3"
                        >
                            {loading ? 'Publishing...' : 'Publish Blog Post'}
                        </Button>
                        <Link href="/admin" className="flex-1">
                            <Button type="button" className="w-full rounded-full border border-border bg-white hover:bg-cream text-foreground h-11 text-[11px] uppercase tracking-[0.16em] font-semibold py-3">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </main>
        </div>
    )
}

