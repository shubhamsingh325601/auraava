"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import ProtectedRoute from "@/components/auth/protected-route"
import { AdminPageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Users, Plus, Trash2, Edit, Loader2 } from "lucide-react"

interface FounderStory {
    id: string
    name: string
    role: string
    photo: string
    quote: string
    order: number
}

export default function AdminFounderStoriesPage() {
    const [stories, setStories] = useState<FounderStory[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStories()
    }, [])

    const fetchStories = async () => {
        try {
            const res = await fetch('/api/founder-stories')
            const data = await res.json()
            setStories(data.stories || [])
        } catch (error) {
            console.error('Failed to fetch founder stories:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this founder story?')) return

        try {
            const res = await fetch(`/api/founder-stories/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setStories(prev => prev.filter(s => s.id !== id))
            } else {
                alert('Failed to delete founder story')
            }
        } catch (error) {
            console.error('Failed to delete founder story:', error)
            alert('Failed to delete founder story')
        }
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-ivory">
                <AdminPageHeader
                    icon={Users}
                    eyebrow="Our Story"
                    title={`Founder Stories${loading ? '' : ` (${stories.length})`}`}
                    actions={
                        <Link href="/admin/founder-stories/new">
                            <Button className="rounded-full bg-primary hover:bg-primary-light text-primary-foreground flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] font-semibold">
                                <Plus className="w-4 h-4" />
                                Add Founder
                            </Button>
                        </Link>
                    }
                />

                <main className="container-x py-10">
                    <div className="bg-cream rounded-2xl shadow-card p-6">
                        {loading ? (
                            <div className="flex items-center justify-center gap-3 text-muted-foreground py-12">
                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                <span>Loading founder stories...</span>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {stories.map((story) => (
                                    <div key={story.id} className="flex items-center justify-between gap-4 p-4 bg-white border border-border rounded-xl">
                                        <div className="flex items-center gap-4 min-w-0">
                                            {story.photo && (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={story.photo} alt={story.name} className="w-14 h-14 rounded-full object-cover shrink-0" />
                                            )}
                                            <div className="min-w-0">
                                                <p className="font-semibold text-foreground">{story.name}</p>
                                                <p className="text-sm text-accent">{story.role}</p>
                                                {story.quote && (
                                                    <p className="text-sm text-muted-foreground mt-1 max-w-xl italic truncate">&ldquo;{story.quote}&rdquo;</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <Link href={`/admin/founder-stories/${story.id}`}>
                                                <Button size="sm" className="rounded-full border border-border bg-white hover:bg-cream text-foreground">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                onClick={() => handleDelete(story.id)}
                                                className="rounded-full border border-destructive/30 bg-white hover:bg-destructive/10 text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {stories.length === 0 && (
                                    <p className="text-muted-foreground text-center py-4">No founder stories yet</p>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    )
}
