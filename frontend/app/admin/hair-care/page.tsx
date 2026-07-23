"use client"

import { adminFetch } from "@/lib/admin-fetch"

import { useState, useEffect } from "react"
import Link from "next/link"
import ProtectedRoute from "@/components/auth/protected-route"
import { AdminPageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Sparkles, Plus, Edit, Trash2, Loader2 } from "lucide-react"

interface HairCareItem {
    id: string
    title: string
    order: number
}

export default function AdminHairCarePage() {
    const [items, setItems] = useState<HairCareItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchItems()
    }, [])

    const fetchItems = async () => {
        try {
            const res = await adminFetch('/api/hair-care')
            const data = await res.json()
            setItems(data.items || [])
        } catch (error) {
            console.error('Failed to fetch hair care tips:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this hair care tip?')) return

        try {
            const res = await adminFetch(`/api/hair-care/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setItems(prev => prev.filter(i => i.id !== id))
            } else {
                alert('Failed to delete hair care tip')
            }
        } catch (error) {
            console.error('Failed to delete hair care tip:', error)
            alert('Failed to delete hair care tip')
        }
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-ivory">
                <AdminPageHeader
                    icon={Sparkles}
                    eyebrow="Home Page"
                    title={`Hair Care Tips${loading ? '' : ` (${items.length})`}`}
                    actions={
                        <Link href="/admin/hair-care/new">
                            <Button className="rounded-full bg-primary hover:bg-primary-light text-primary-foreground flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] font-semibold">
                                <Plus className="w-4 h-4" />
                                Add Hair Care Tip
                            </Button>
                        </Link>
                    }
                />

                <main className="container-x py-10">
                    <div className="bg-cream rounded-2xl shadow-card p-6">
                        {loading ? (
                            <div className="flex items-center justify-center gap-3 text-muted-foreground py-12">
                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                <span>Loading hair care tips...</span>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-border rounded-xl">
                                        <div>
                                            <p className="font-semibold text-foreground">{item.title}</p>
                                            <p className="text-sm text-muted-foreground">Order: {item.order}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={`/admin/hair-care/${item.id}`}>
                                                <Button size="sm" className="rounded-full border border-border bg-white hover:bg-cream text-foreground">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                onClick={() => handleDelete(item.id)}
                                                className="rounded-full border border-destructive/30 bg-white hover:bg-destructive/10 text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {items.length === 0 && (
                                    <p className="text-muted-foreground text-center py-4">No hair care tips yet</p>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    )
}
