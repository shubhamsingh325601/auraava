"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Plus, X, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminPageHeader } from "@/components/admin/page-header"

interface StatItem {
    id: string
    label: string
    number: string
    order: number
}

export default function ManageStatsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [stats, setStats] = useState<StatItem[]>([])

    useEffect(() => {
        fetchStatsData()
    }, [])

    const fetchStatsData = async () => {
        try {
            const res = await fetch('/api/stats')
            const data = await res.json()
            if (data.items) {
                // Ensure we have at least 2 items, max 4
                const items = data.items.slice(0, 4)
                while (items.length < 2) {
                    items.push({
                        id: Date.now().toString() + Math.random(),
                        label: "",
                        number: "",
                        order: items.length + 1
                    })
                }
                setStats(items)
            } else {
                // Initialize with 2 empty items
                setStats([
                    { id: "1", label: "", number: "", order: 1 },
                    { id: "2", label: "", number: "", order: 2 }
                ])
            }
        } catch (error) {
            console.error('Failed to fetch stats data:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateStat = (index: number, field: keyof StatItem, value: string | number) => {
        const updatedStats = [...stats]
        updatedStats[index] = { ...updatedStats[index], [field]: value }
        setStats(updatedStats)
    }

    const addStat = () => {
        if (stats.length >= 4) {
            alert('Maximum 4 statistics allowed')
            return
        }
        const newStat: StatItem = {
            id: Date.now().toString(),
            label: "",
            number: "",
            order: stats.length + 1
        }
        setStats([...stats, newStat])
    }

    const removeStat = (index: number) => {
        if (stats.length <= 2) {
            alert('Minimum 2 statistics required')
            return
        }
        const updatedStats = stats.filter((_, i) => i !== index)
        // Reorder
        updatedStats.forEach((stat, i) => {
            stat.order = i + 1
        })
        setStats(updatedStats)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            // Filter out empty stats
            const validStats = stats.filter(stat => stat.label.trim() && stat.number.trim())
            
            if (validStats.length < 2) {
                alert('Please fill at least 2 statistics')
                setSaving(false)
                return
            }

            const res = await fetch('/api/stats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: validStats }),
            })

            if (res.ok) {
                router.push('/admin')
            } else {
                alert('Failed to save statistics')
            }
        } catch (error) {
            console.error('Failed to save statistics:', error)
            alert('Failed to save statistics')
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
            <AdminPageHeader
                icon={BarChart3}
                eyebrow="Home Page"
                title="Manage Statistics"
                subtitle="Add 2-4 statistics to display on the home page"
            />

            <main className="container-x py-10 max-w-4xl">
                <form onSubmit={handleSubmit} className="bg-cream rounded-2xl shadow-card p-8 space-y-6">
                    {stats.map((stat, index) => (
                        <div key={stat.id} className="bg-white border border-border rounded-xl p-4 space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xs uppercase tracking-wider font-semibold text-primary">Statistic {index + 1}</h3>
                                {stats.length > 2 && (
                                    <button
                                        type="button"
                                        onClick={() => removeStat(index)}
                                        className="rounded-full border border-destructive/30 bg-white hover:bg-destructive/10 text-destructive p-1.5 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Label *</label>
                                    <input
                                        type="text"
                                        required
                                        value={stat.label}
                                        onChange={(e) => updateStat(index, 'label', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                        placeholder="e.g., Happy Customers"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Number *</label>
                                    <input
                                        type="text"
                                        required
                                        value={stat.number}
                                        onChange={(e) => updateStat(index, 'number', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                        placeholder="e.g., 10K+, 500, 5+"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {stats.length < 4 && (
                        <button
                            type="button"
                            onClick={addStat}
                            className="w-full rounded-xl border border-border bg-white hover:bg-cream p-4 text-muted-foreground hover:text-accent-gold transition-colors flex items-center justify-center gap-2 h-11 text-[11px] uppercase tracking-[0.16em] font-semibold"
                        >
                            <Plus className="w-4 h-4" />
                            Add Another Statistic
                        </button>
                    )}

                    <div className="flex gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={saving}
                            className="flex-1 rounded-full bg-primary hover:bg-primary-light text-primary-foreground h-11 text-[11px] uppercase tracking-[0.16em] font-semibold"
                        >
                            {saving ? 'Saving...' : 'Save Statistics'}
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

