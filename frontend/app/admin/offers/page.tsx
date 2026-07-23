"use client"

import { adminFetch } from "@/lib/admin-fetch"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Upload, X, Eye, EyeOff, Trash2, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminPageHeader } from "@/components/admin/page-header"
import { uploadImage } from "@/lib/upload-image"

interface OfferItem {
    id: string
    title: string
    description: string
    image: string
    discount: string
    link: string
    order: number
}

export default function ManageOffersPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploadingImage, setUploadingImage] = useState<number | null>(null)
    const [sectionTitle, setSectionTitle] = useState("✨ Mega Sale Week ✨")
    const [sectionSubtitle, setSectionSubtitle] = useState("Get up to <span class=\"font-bold\">50% off</span> on your favorite hair care bundles.<br/>Limited time offers on Auraava bestsellers!")
    const [isVisible, setIsVisible] = useState(true)
    const [offers, setOffers] = useState<OfferItem[]>([])
    const [originalOfferIds, setOriginalOfferIds] = useState<Set<string>>(new Set())

    useEffect(() => {
        fetchOffersData()
    }, [])

    const fetchOffersData = async () => {
        try {
            const res = await adminFetch('/api/offers')
            const data = await res.json()
            if (data.sectionTitle) setSectionTitle(data.sectionTitle)
            if (data.sectionSubtitle) setSectionSubtitle(data.sectionSubtitle)
            setIsVisible(data.isVisible !== false)
            if (data.offers) {
                setOffers(data.offers)
                setOriginalOfferIds(new Set(data.offers.map((o: OfferItem) => o.id)))
            } else {
                // Initialize with empty offers if none exist
                setOffers([
                    { id: "new-1", title: "", description: "", image: "", discount: "", link: "/shop", order: 1 },
                    { id: "new-2", title: "", description: "", image: "", discount: "", link: "/shop", order: 2 },
                    { id: "new-3", title: "", description: "", image: "", discount: "", link: "/shop", order: 3 },
                ])
            }
        } catch (error) {
            console.error('Failed to fetch offers data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingImage(index)
        try {
            const url = await uploadImage(file)
            if (url) {
                const updatedOffers = [...offers]
                updatedOffers[index] = { ...updatedOffers[index], image: url }
                setOffers(updatedOffers)
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

    const updateOffer = (index: number, field: keyof OfferItem, value: string | number) => {
        const updatedOffers = [...offers]
        updatedOffers[index] = { ...updatedOffers[index], [field]: value }
        setOffers(updatedOffers)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            // First, update section metadata
            const metadataRes = await adminFetch('/api/offers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sectionTitle,
                    sectionSubtitle,
                    isVisible
                }),
            })

            if (!metadataRes.ok) {
                const errorData = await metadataRes.json().catch(() => ({}))
                throw new Error(errorData.error || 'Failed to update section metadata')
            }

            // Then handle each offer item
            for (const offer of offers) {
                const isNew = !originalOfferIds.has(offer.id) || offer.id.startsWith('new-')
                
                if (isNew) {
                    // Create new offer item
                    const res = await adminFetch('/api/offers', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'add',
                            item: {
                                title: offer.title,
                                description: offer.description,
                                image: offer.image,
                                discount: offer.discount,
                                link: offer.link,
                                order: offer.order
                            }
                        }),
                    })

                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({}))
                        throw new Error(errorData.error || `Failed to create offer item`)
                    }
                } else {
                    // Update existing offer item using PUT
                    const res = await adminFetch(`/api/offers/${offer.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            title: offer.title,
                            description: offer.description,
                            image: offer.image,
                            discount: offer.discount,
                            link: offer.link,
                            order: offer.order
                        }),
                    })

                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({}))
                        throw new Error(errorData.error || `Failed to update offer item ${offer.id}`)
                    }
                }
            }

            router.push('/admin')
        } catch (error) {
            console.error('Failed to save offers:', error)
            alert(error instanceof Error ? error.message : 'Failed to save offers')
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
            <AdminPageHeader icon={Tag} eyebrow="Special Offers" title="Manage Special Offers" />

            <main className="container-x py-10 max-w-6xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Section Settings */}
                    <div className="bg-cream rounded-2xl shadow-card p-6 space-y-6">
                        <h2 className="text-xl font-display font-bold text-primary">Section Settings</h2>

                        <div>
                            <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Section Title *</label>
                            <input
                                type="text"
                                required
                                value={sectionTitle}
                                onChange={(e) => setSectionTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                placeholder="✨ Mega Sale Week ✨"
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Section Subtitle *</label>
                            <textarea
                                required
                                value={sectionSubtitle.replace(/<br\/>/g, '\n')}
                                onChange={(e) => setSectionSubtitle(e.target.value.replace(/\n/g, '<br/>'))}
                                rows={3}
                                className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                placeholder="Get up to 50% off on your favorite hair care bundles."
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                                Use line breaks for multiple lines. HTML is supported (e.g., &lt;span class=&quot;font-bold&quot;&gt;text&lt;/span&gt;)
                            </p>
                        </div>

                        <div className="bg-white border border-border rounded-xl p-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={isVisible}
                                    onChange={(e) => setIsVisible(e.target.checked)}
                                    className="w-4 h-4 accent-primary"
                                />
                                <span className="text-xs uppercase tracking-wider font-semibold text-primary">Show Section on Website</span>
                                {isVisible ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                            </label>
                        </div>
                    </div>

                    {/* Offer Items */}
                    <div className="bg-cream rounded-2xl shadow-card p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-display font-bold text-primary">Offer Items</h2>
                            <Button
                                type="button"
                                className="rounded-full border border-border bg-white hover:bg-cream text-foreground h-11 text-[11px] uppercase tracking-[0.16em] font-semibold"
                                onClick={() => {
                                    const newOrder = offers.length > 0 ? Math.max(...offers.map(o => o.order)) + 1 : 1
                                    setOffers([...offers, {
                                        id: `new-${Date.now()}`,
                                        title: "",
                                        description: "",
                                        image: "",
                                        discount: "",
                                        link: "/shop",
                                        order: newOrder
                                    }])
                                }}
                            >
                                Add Offer
                            </Button>
                        </div>

                        {offers.map((offer, index) => (
                            <div key={offer.id} className="bg-white border border-border rounded-xl p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs uppercase tracking-wider font-semibold text-primary">Offer {index + 1}</h3>
                                    {originalOfferIds.has(offer.id) && !offer.id.startsWith('new-') && (
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={async () => {
                                                if (!confirm('Are you sure you want to delete this offer?')) return
                                                
                                                try {
                                                    const res = await adminFetch(`/api/offers/${offer.id}`, {
                                                        method: 'DELETE'
                                                    })
                                                    
                                                    if (res.ok) {
                                                        setOffers(prev => prev.filter(o => o.id !== offer.id))
                                                        setOriginalOfferIds(prev => {
                                                            const newSet = new Set(prev)
                                                            newSet.delete(offer.id)
                                                            return newSet
                                                        })
                                                    } else {
                                                        alert('Failed to delete offer')
                                                    }
                                                } catch (error) {
                                                    console.error('Failed to delete offer:', error)
                                                    alert('Failed to delete offer')
                                                }
                                            }}
                                            className="rounded-full border border-destructive/30 bg-white hover:bg-destructive/10 text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </Button>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Title *</label>
                                        <input
                                            type="text"
                                            required
                                            value={offer.title}
                                            onChange={(e) => updateOffer(index, 'title', e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                            placeholder="e.g., Curl Care Combo"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Discount Text *</label>
                                        <input
                                            type="text"
                                            required
                                            value={offer.discount}
                                            onChange={(e) => updateOffer(index, 'discount', e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                            placeholder="e.g., 30% OFF"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Description *</label>
                                    <textarea
                                        required
                                        value={offer.description}
                                        onChange={(e) => updateOffer(index, 'description', e.target.value)}
                                        rows={2}
                                        className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                        placeholder="Perfect duo for defined, frizz-free curls."
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Link *</label>
                                        <input
                                            type="text"
                                            required
                                            value={offer.link}
                                            onChange={(e) => updateOffer(index, 'link', e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                            placeholder="/shop"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Image *</label>
                                        <div className="space-y-4">
                                            {offer.image && (
                                                <div className="relative w-full h-48 rounded-xl overflow-hidden bg-muted border border-border">
                                                    <img src={offer.image} alt={`Offer ${index + 1}`} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => updateOffer(index, 'image', '')}
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
                                                    onChange={(e) => handleImageUpload(index, e)}
                                                    className="hidden"
                                                    disabled={uploadingImage === index}
                                                />
                                                <span className="inline-flex items-center rounded-full border border-border bg-white hover:bg-cream text-foreground px-4 py-3 cursor-pointer h-11 text-[11px] uppercase tracking-[0.16em] font-semibold transition-colors">
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    {uploadingImage === index ? 'Uploading...' : 'Upload Image'}
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={saving || offers.some(o => !o.title || !o.description || !o.image || !o.discount)}
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

