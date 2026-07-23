"use client"

import { adminFetch } from "@/lib/admin-fetch"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Upload, X, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminPageHeader } from "@/components/admin/page-header"
import { uploadImage } from "@/lib/upload-image"

export default function EditFounderStoryPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        photo: "",
        quote: "",
        story: "",
        instagram: "",
        linkedin: "",
        order: 1,
    })

    useEffect(() => {
        fetchStory()
    }, [])

    const fetchStory = async () => {
        try {
            const res = await adminFetch(`/api/founder-stories/${params.id}`)
            const data = await res.json()
            if (data.story) {
                setFormData({
                    name: data.story.name,
                    role: data.story.role,
                    photo: data.story.photo,
                    quote: data.story.quote,
                    story: data.story.story,
                    instagram: data.story.instagram || "",
                    linkedin: data.story.linkedin || "",
                    order: data.story.order,
                })
            }
        } catch (error) {
            console.error('Failed to fetch founder story:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingImage(true)
        try {
            const url = await uploadImage(file)
            if (url) {
                setFormData(prev => ({ ...prev, photo: url }))
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
        setSaving(true)

        try {
            const res = await adminFetch(`/api/founder-stories/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                router.push('/admin/founder-stories')
            } else {
                alert('Failed to update founder story')
            }
        } catch (error) {
            console.error('Failed to update founder story:', error)
            alert('Failed to update founder story')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-ivory flex items-center justify-center">
                <div className="flex items-center justify-center gap-3 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin text-primary" /><span>Loading...</span></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-ivory">
            <AdminPageHeader icon={Users} eyebrow="Our Story" title="Edit Founder Story" backHref="/admin/founder-stories" />

            <main className="container-x py-10 max-w-3xl">
                <form onSubmit={handleSubmit} className="bg-cream rounded-2xl shadow-card p-8 space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Role *</label>
                            <input
                                type="text"
                                required
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Quote *</label>
                        <textarea
                            required
                            value={formData.quote}
                            onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Story *</label>
                        <textarea
                            required
                            value={formData.story}
                            onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                            rows={6}
                            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        />
                        <p className="text-sm text-muted-foreground mt-1">Use blank lines to separate paragraphs.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Instagram (Optional)</label>
                            <input
                                type="url"
                                value={formData.instagram}
                                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                placeholder="https://instagram.com/..."
                                className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">LinkedIn (Optional)</label>
                            <input
                                type="url"
                                value={formData.linkedin}
                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                placeholder="https://linkedin.com/in/..."
                                className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                            />
                        </div>
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
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Photo *</label>
                        <div className="space-y-4">
                            {formData.photo && (
                                <div className="relative w-40 h-40 rounded-full overflow-hidden border border-border">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={formData.photo} alt="Founder" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, photo: "" })}
                                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1.5"
                                    >
                                        <X className="w-3.5 h-3.5" />
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
                                    {uploadingImage ? 'Uploading...' : 'Upload Photo'}
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={saving || !formData.photo}
                            className="flex-1 rounded-full bg-primary hover:bg-primary-light text-primary-foreground h-11 text-[11px] uppercase tracking-[0.16em] font-semibold"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Link href="/admin/founder-stories" className="flex-1">
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
