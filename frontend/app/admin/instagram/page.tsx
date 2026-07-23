"use client"

import { adminFetch } from "@/lib/admin-fetch"

import { useState, useEffect } from "react"
import Link from "next/link"
import ProtectedRoute from "@/components/auth/protected-route"
import { AdminPageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Instagram, Plus, Edit, Trash2, Loader2 } from "lucide-react"

interface InstagramPost {
    id: string
    image: string
    order: number
}

export default function AdminInstagramPage() {
    const [posts, setPosts] = useState<InstagramPost[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            const res = await adminFetch('/api/instagram')
            const data = await res.json()
            setPosts(data.posts || [])
        } catch (error) {
            console.error('Failed to fetch Instagram posts:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this Instagram post?')) return

        try {
            const res = await adminFetch(`/api/instagram/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setPosts(prev => prev.filter(p => p.id !== id))
            } else {
                alert('Failed to delete Instagram post')
            }
        } catch (error) {
            console.error('Failed to delete Instagram post:', error)
            alert('Failed to delete Instagram post')
        }
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-ivory">
                <AdminPageHeader
                    icon={Instagram}
                    eyebrow="Home Page"
                    title={`Instagram Posts${loading ? '' : ` (${posts.length})`}`}
                    actions={
                        <Link href="/admin/instagram/new">
                            <Button className="rounded-full bg-primary hover:bg-primary-light text-primary-foreground flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] font-semibold">
                                <Plus className="w-4 h-4" />
                                Add Instagram Post
                            </Button>
                        </Link>
                    }
                />

                <main className="container-x py-10">
                    <div className="bg-cream rounded-2xl shadow-card p-6">
                        {loading ? (
                            <div className="flex items-center justify-center gap-3 text-muted-foreground py-12">
                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                <span>Loading Instagram posts...</span>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {posts.map((post) => (
                                    <div key={post.id} className="flex items-center justify-between p-4 bg-white border border-border rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                                                <img src={post.image} alt="Instagram" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">Post #{post.id}</p>
                                                <p className="text-sm text-muted-foreground">Order: {post.order}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={`/admin/instagram/${post.id}`}>
                                                <Button size="sm" className="rounded-full border border-border bg-white hover:bg-cream text-foreground">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                onClick={() => handleDelete(post.id)}
                                                className="rounded-full border border-destructive/30 bg-white hover:bg-destructive/10 text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {posts.length === 0 && (
                                    <p className="text-muted-foreground text-center py-4">No Instagram posts yet</p>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    )
}
