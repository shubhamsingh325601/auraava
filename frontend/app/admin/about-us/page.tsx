"use client"

import { adminFetch } from "@/lib/admin-fetch"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Upload, X, Plus, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminPageHeader } from "@/components/admin/page-header"
import { uploadImage } from "@/lib/upload-image"

interface AboutUsSection {
    id: string
    title: string
    subtitle?: string
    content: string
    image: string
    backgroundColor: string
    textColor: string
    layout: 'text-left' | 'text-right'
    order: number
}

export default function ManageAboutUsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploadingImage, setUploadingImage] = useState<string | null>(null)
    const [sections, setSections] = useState<AboutUsSection[]>([])
    const [originalSectionIds, setOriginalSectionIds] = useState<Set<string>>(new Set())

    useEffect(() => {
        fetchAboutUsData()
    }, [])

    const fetchAboutUsData = async () => {
        try {
            const res = await adminFetch('/api/about-us')
            const data = await res.json()
            if (data.sections) {
                setSections(data.sections)
                setOriginalSectionIds(new Set(data.sections.map((s: AboutUsSection) => s.id)))
            }
        } catch (error) {
            console.error('Failed to fetch about-us data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleImageUpload = async (sectionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingImage(sectionId)
        try {
            const url = await uploadImage(file)
            if (url) {
                updateSection(sectionId, 'image', url)
            } else {
                alert('Failed to upload image')
            }
        } catch (error) {
            console.error('Failed to upload image:', error)
            alert('Failed to upload image')
        } finally {
            setUploadingImage(null)
        }
    }

    const updateSection = (id: string, field: keyof AboutUsSection, value: string | number) => {
        setSections(prev => prev.map(section => 
            section.id === id ? { ...section, [field]: value } : section
        ))
    }

    const addSection = () => {
        const newSection: AboutUsSection = {
            id: `new-${Date.now()}`,
            title: "",
            content: "",
            image: "",
            backgroundColor: "#FAF6F0",
            textColor: "#1A3A2A",
            layout: 'text-left',
            order: sections.length + 1
        }
        setSections([...sections, newSection])
    }

    const deleteSection = async (id: string) => {
        if (!confirm('Are you sure you want to delete this section?')) return

        try {
            const res = await adminFetch(`/api/about-us/${id}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                setSections(prev => prev.filter(s => s.id !== id))
            } else {
                alert('Failed to delete section')
            }
        } catch (error) {
            console.error('Failed to delete section:', error)
            alert('Failed to delete section')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            // Process all sections
            for (const section of sections) {
                const isNew = !originalSectionIds.has(section.id)
                
                if (isNew) {
                    // New section - add it
                    const res = await adminFetch('/api/about-us', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'add',
                            section: {
                                title: section.title,
                                subtitle: section.subtitle || undefined,
                                content: section.content,
                                image: section.image,
                                backgroundColor: section.backgroundColor,
                                textColor: section.textColor,
                                layout: section.layout,
                                order: section.order
                            }
                        }),
                    })

                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({}))
                        throw new Error(errorData.error || 'Failed to add section')
                    }
                } else {
                    // Existing section - update it
                    const res = await adminFetch('/api/about-us', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: section.id,
                            update: {
                                title: section.title,
                                subtitle: section.subtitle || undefined,
                                content: section.content,
                                image: section.image,
                                backgroundColor: section.backgroundColor,
                                textColor: section.textColor,
                                layout: section.layout,
                                order: section.order
                            }
                        }),
                    })

                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({}))
                        throw new Error(errorData.error || 'Failed to update section')
                    }
                }
            }

            router.push('/admin')
        } catch (error) {
            console.error('Failed to save about-us:', error)
            alert(error instanceof Error ? error.message : 'Failed to save about-us')
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
            <AdminPageHeader icon={Users} eyebrow="About Us" title="Manage About Us Page" />

            <main className="container-x py-10 max-w-6xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {sections.map((section, index) => (
                        <div key={section.id} className="bg-cream rounded-2xl shadow-card p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-display font-bold text-primary">Section {index + 1}</h2>
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => deleteSection(section.id)}
                                    className="rounded-full border border-destructive/30 bg-white hover:bg-destructive/10 text-destructive"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </Button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Title *</label>
                                    <input
                                        type="text"
                                        required
                                        value={section.title}
                                        onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                        placeholder="Section title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Subtitle (optional)</label>
                                    <input
                                        type="text"
                                        value={section.subtitle || ''}
                                        onChange={(e) => updateSection(section.id, 'subtitle', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                        placeholder="e.g., Meet The Founders"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Content *</label>
                                <textarea
                                    required
                                    value={section.content}
                                    onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                                    rows={6}
                                    className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                    placeholder="Section content... (supports HTML and line breaks)"
                                />
                                <p className="text-sm text-muted-foreground mt-1">
                                    Use &lt;strong&gt; for bold text. Line breaks are preserved.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Background Color *</label>
                                    <div className="flex gap-2 items-center bg-white border border-border rounded-lg p-2">
                                        <input
                                            type="color"
                                            value={section.backgroundColor}
                                            onChange={(e) => updateSection(section.id, 'backgroundColor', e.target.value)}
                                            className="w-10 h-10 rounded cursor-pointer border border-border"
                                        />
                                        <input
                                            type="text"
                                            value={section.backgroundColor}
                                            onChange={(e) => updateSection(section.id, 'backgroundColor', e.target.value)}
                                            className="flex-1 px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-accent rounded-md transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Text Color *</label>
                                    <div className="flex gap-2 items-center bg-white border border-border rounded-lg p-2">
                                        <input
                                            type="color"
                                            value={section.textColor}
                                            onChange={(e) => updateSection(section.id, 'textColor', e.target.value)}
                                            className="w-10 h-10 rounded cursor-pointer border border-border"
                                        />
                                        <input
                                            type="text"
                                            value={section.textColor}
                                            onChange={(e) => updateSection(section.id, 'textColor', e.target.value)}
                                            className="flex-1 px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-accent rounded-md transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Layout *</label>
                                    <select
                                        value={section.layout}
                                        onChange={(e) => updateSection(section.id, 'layout', e.target.value as 'text-left' | 'text-right')}
                                        className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                    >
                                        <option value="text-left">Text Left, Image Right</option>
                                        <option value="text-right">Image Left, Text Right</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Order *</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={section.order}
                                    onChange={(e) => updateSection(section.id, 'order', parseInt(e.target.value) || 1)}
                                    className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Image *</label>
                                <div className="space-y-4">
                                    {section.image && (
                                        <div className="relative w-full h-64 rounded-xl overflow-hidden bg-muted border border-border">
                                            <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => updateSection(section.id, 'image', '')}
                                                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-2"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}

                                    <label className="inline-block">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(section.id, e)}
                                            className="hidden"
                                            disabled={uploadingImage === section.id}
                                        />
                                        <span className="inline-flex items-center rounded-full border border-border bg-white hover:bg-cream text-foreground px-4 py-3 cursor-pointer h-11 text-[11px] uppercase tracking-[0.16em] font-semibold transition-colors">
                                            <Upload className="w-4 h-4 mr-2" />
                                            {uploadingImage === section.id ? 'Uploading...' : 'Upload Image'}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}

                    <Button
                        type="button"
                        onClick={addSection}
                        className="w-full rounded-full border border-border bg-white hover:bg-cream text-foreground h-11 text-[11px] uppercase tracking-[0.16em] font-semibold"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Section
                    </Button>

                    {/* Submit */}
                    <div className="flex gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={saving || sections.some(s => !s.title || !s.content || !s.image)}
                            className="flex-1 rounded-full bg-primary hover:bg-primary-light text-primary-foreground py-3 h-11 text-[11px] uppercase tracking-[0.16em] font-semibold"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Link href="/admin" className="flex-1">
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

