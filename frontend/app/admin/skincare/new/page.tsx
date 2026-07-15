"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Upload, X, Droplet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminPageHeader } from "@/components/admin/page-header"
import { uploadImage } from "@/lib/upload-image"

export default function NewSkincarePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "",
        reverse: false,
        order: 1,
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/skincare', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                router.push('/admin')
            } else {
                alert('Failed to create skincare tip')
            }
        } catch (error) {
            console.error('Failed to create skincare tip:', error)
            alert('Failed to create skincare tip')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-ivory">
            <AdminPageHeader icon={Droplet} eyebrow="Skincare" title="Add New Skincare Tip" />

            <main className="container-x py-10 max-w-3xl">
                <form onSubmit={handleSubmit} className="bg-cream rounded-2xl shadow-card p-8 space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Title *</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                            placeholder="e.g., Cleanse Gently, Glow Naturally"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Description *</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                            placeholder="Describe the skincare tip..."
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
                        <p className="text-xs text-muted-foreground mt-2">
                            Lower numbers appear first
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Image *</label>
                        <div className="space-y-4">
                            {formData.image && (
                                <div className="relative w-full h-64 rounded-xl overflow-hidden border border-border">
                                    <img src={formData.image} alt="Skincare" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, image: "" })}
                                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-2 shadow-card hover:bg-destructive/90 transition-colors"
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
                                <span className="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-border bg-white hover:bg-cream text-foreground h-11 text-[11px] uppercase tracking-[0.16em] font-semibold cursor-pointer transition-colors">
                                    <Upload className="w-4 h-4" />
                                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-white border border-border rounded-xl">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.reverse}
                                onChange={(e) => setFormData({ ...formData, reverse: e.target.checked })}
                                className="w-4 h-4 accent-primary"
                            />
                            <span className="text-sm font-medium text-foreground">Reverse Layout (Image on right)</span>
                        </label>
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-border">
                        <Button
                            type="submit"
                            disabled={loading || !formData.image}
                            className="flex-1 rounded-full bg-primary hover:bg-primary-light text-primary-foreground py-3 h-11 text-[11px] uppercase tracking-[0.16em] font-semibold"
                        >
                            {loading ? 'Creating...' : 'Create Skincare Tip'}
                        </Button>
                        <Link href="/admin" className="flex-1">
                            <Button type="button" className="w-full rounded-full border border-border bg-white hover:bg-cream text-foreground py-3 h-11 text-[11px] uppercase tracking-[0.16em] font-semibold">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </main>
        </div>
    )
}

