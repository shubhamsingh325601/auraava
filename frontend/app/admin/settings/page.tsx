"use client"

import { adminFetch } from "@/lib/admin-fetch"

import { useState, useEffect } from "react"
import { Loader2, Settings2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminPageHeader } from "@/components/admin/page-header"
import ProtectedRoute from "@/components/auth/protected-route"

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [whatsappNumber, setWhatsappNumber] = useState("")
    const [contactPhone, setContactPhone] = useState("")

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await adminFetch('/api/settings')
            const data = await res.json()
            setWhatsappNumber(data.whatsappNumber || "")
            setContactPhone(data.contactPhone || "")
        } catch (error) {
            console.error('Failed to fetch settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await adminFetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ whatsappNumber, contactPhone }),
            })
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}))
                throw new Error(errorData.error || 'Failed to save settings')
            }
            alert('Settings saved successfully')
        } catch (error) {
            console.error('Failed to save settings:', error)
            alert('Failed to save settings')
        } finally {
            setSaving(false)
        }
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-ivory">
                <AdminPageHeader
                    icon={Settings2}
                    eyebrow="Site Configuration"
                    title="Settings"
                    subtitle="Contact details shown across the site"
                />

                <main className="container-x py-10 max-w-2xl">
                    {loading ? (
                        <div className="flex items-center justify-center gap-3 text-muted-foreground py-12">
                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                            <span>Loading settings...</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="bg-cream rounded-2xl shadow-card p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    WhatsApp Number
                                </label>
                                <input
                                    type="text"
                                    value={whatsappNumber}
                                    onChange={(e) => setWhatsappNumber(e.target.value)}
                                    placeholder="919818024742"
                                    className="w-full px-4 h-11 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    required
                                />
                                <p className="mt-1.5 text-xs text-muted-foreground">
                                    Used by the floating WhatsApp button, footer, navigation and product &quot;Chat on WhatsApp&quot; links.
                                    International format, no + or spaces (e.g. 919818024742).
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    Display Phone Number
                                </label>
                                <input
                                    type="text"
                                    value={contactPhone}
                                    onChange={(e) => setContactPhone(e.target.value)}
                                    placeholder="+91 9818024742"
                                    className="w-full px-4 h-11 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    required
                                />
                                <p className="mt-1.5 text-xs text-muted-foreground">
                                    Shown as the readable contact number in the footer, About Us and FAQs pages, and used for &quot;Call now&quot; links.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                disabled={saving}
                                className="rounded-full bg-primary hover:bg-primary-light text-primary-foreground flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] font-semibold"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {saving ? "Saving..." : "Save Settings"}
                            </Button>
                        </form>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    )
}
