"use client"

import { adminFetch } from "@/lib/admin-fetch"

import { useState, useEffect } from "react"
import Link from "next/link"
import ProtectedRoute from "@/components/auth/protected-route"
import { AdminPageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { ImageIcon, Plus, Edit, Trash2, Loader2, Eye, EyeOff } from "lucide-react"

interface HeroBanner {
    id: string
    image: string
    link: string
    order: number
    active: boolean
}

export default function AdminHeroBannersPage() {
    const [banners, setBanners] = useState<HeroBanner[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchBanners()
    }, [])

    const fetchBanners = async () => {
        try {
            const res = await adminFetch('/api/hero-banners/all')
            const data = await res.json()
            setBanners(data.banners || [])
        } catch (error) {
            console.error('Failed to fetch hero banners:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this hero banner?')) return

        try {
            const res = await adminFetch(`/api/hero-banners/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setBanners(prev => prev.filter(b => b.id !== id))
            } else {
                alert('Failed to delete hero banner')
            }
        } catch (error) {
            console.error('Failed to delete hero banner:', error)
            alert('Failed to delete hero banner')
        }
    }

    const handleToggleActive = async (banner: HeroBanner) => {
        try {
            const res = await adminFetch(`/api/hero-banners/${banner.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !banner.active }),
            })
            if (res.ok) {
                setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, active: !b.active } : b))
            } else {
                alert('Failed to update hero banner')
            }
        } catch (error) {
            console.error('Failed to update hero banner:', error)
            alert('Failed to update hero banner')
        }
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-ivory">
                <AdminPageHeader
                    icon={ImageIcon}
                    eyebrow="Home Page"
                    title={`Hero Banners${loading ? '' : ` (${banners.length})`}`}
                    actions={
                        <Link href="/admin/hero-banners/new">
                            <Button className="rounded-full bg-primary hover:bg-primary-light text-primary-foreground flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] font-semibold">
                                <Plus className="w-4 h-4" />
                                Add Hero Banner
                            </Button>
                        </Link>
                    }
                />

                <main className="container-x py-10">
                    <div className="bg-cream rounded-2xl shadow-card p-6">
                        <p className="text-sm text-muted-foreground mb-4">
                            These banners appear in the home page hero carousel, ordered by their position (lower = first).
                        </p>
                        {loading ? (
                            <div className="flex items-center justify-center gap-3 text-muted-foreground py-12">
                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                <span>Loading hero banners...</span>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {banners.map((banner) => (
                                    <div key={banner.id} className="flex items-center justify-between p-4 bg-white border border-border rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-20 h-12 rounded-lg overflow-hidden bg-muted">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={banner.image} alt="Hero banner" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">Banner #{banner.order}</p>
                                                <p className="text-sm text-muted-foreground break-all max-w-sm truncate">{banner.link}</p>
                                                {banner.active ? (
                                                    <span className="inline-flex items-center gap-1 text-xs text-green-600">
                                                        <Eye className="w-3 h-3" /> Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                                        <EyeOff className="w-3 h-3" /> Inactive
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => handleToggleActive(banner)}
                                                className="rounded-full border border-border bg-white hover:bg-cream text-foreground"
                                                title={banner.active ? 'Hide banner' : 'Show banner'}
                                            >
                                                {banner.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </Button>
                                            <Link href={`/admin/hero-banners/${banner.id}`}>
                                                <Button size="sm" className="rounded-full border border-border bg-white hover:bg-cream text-foreground">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                onClick={() => handleDelete(banner.id)}
                                                className="rounded-full border border-destructive/30 bg-white hover:bg-destructive/10 text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {banners.length === 0 && (
                                    <p className="text-muted-foreground text-center py-4">No hero banners yet</p>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    )
}
