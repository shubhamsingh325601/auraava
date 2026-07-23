"use client"

import { adminFetch } from "@/lib/admin-fetch"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Upload, X, Droplet, Sparkles, Dumbbell, Shield, Feather, HandMetal, Star, Heart, Leaf, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminPageHeader } from "@/components/admin/page-header"
import { uploadImage } from "@/lib/upload-image"

const benefitIconOptions = [
    { value: "droplet", label: "Hydration", icon: Droplet },
    { value: "sparkles", label: "Gentle cleansing", icon: Sparkles },
    { value: "dumbbell", label: "Strengthening", icon: Dumbbell },
    { value: "shield", label: "Protection", icon: Shield },
    { value: "feather", label: "Softening", icon: Feather },
    { value: "handMetal", label: "Frizz control", icon: HandMetal },
    { value: "star", label: "Premium", icon: Star },
    { value: "heart", label: "Care", icon: Heart },
    { value: "leaf", label: "Natural", icon: Leaf },
]

export default function EditProductPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        category: "shampoos",
        shortDescription: "",
        fullDescription: "",
        price: "",
        rating: 5,
        reviews: 0,
        inStock: true,
        bestSeller: false,
        sizes: ["100 ML", "237 ML"],
        images: [] as string[],
        keyBenefits: [{ label: "", icon: "droplet" }],
        buttonText: "",
        buttonLink: "",
        whatsappPhoneNumber: "",
        whatsappMessageTemplate: "",
        directCheckoutEnabled: false,
    })

    useEffect(() => {
        fetchProduct()
    }, [])

    const fetchProduct = async () => {
        try {
            const res = await adminFetch(`/api/products/${params.id}`)
            const data = await res.json()
            if (data.product) {
                setFormData({
                    name: data.product.name,
                    category: data.product.category,
                    shortDescription: data.product.shortDescription,
                    fullDescription: data.product.fullDescription,
                    price: data.product.price.toString(),
                    rating: data.product.rating,
                    reviews: data.product.reviews,
                    inStock: data.product.inStock,
                    bestSeller: data.product.bestSeller || false,
                    sizes: data.product.sizes,
                    images: data.product.images,
                    keyBenefits: (data.product.keyBenefits || []).map((b: any) =>
                        typeof b === 'string' ? { label: b, icon: "sparkles" } : b
                    ),
                    buttonText: data.product.buttonText || "",
                    buttonLink: data.product.buttonLink || "",
                    whatsappPhoneNumber: data.product.whatsappPhoneNumber || "",
                    whatsappMessageTemplate: data.product.whatsappMessageTemplate || "",
                    directCheckoutEnabled: data.product.directCheckoutEnabled || false,
                })
            }
        } catch (error) {
            console.error('Failed to fetch product:', error)
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
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, url]
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

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                currency: "$",
                mainImage: formData.images[0] || "",
                keyBenefits: formData.keyBenefits
                    .filter(b => b.label.trim())
                    .map(b => ({ label: b.label.trim(), icon: b.icon || benefitIconOptions[0].value })),
            }

            const res = await adminFetch(`/api/products/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            })

            if (res.ok) {
                router.push('/admin')
            } else {
                alert('Failed to update product')
            }
        } catch (error) {
            console.error('Failed to update product:', error)
            alert('Failed to update product')
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
            <AdminPageHeader icon={Package} eyebrow="Products" title="Edit Product" backHref="/admin/products" />

            <main className="container-x py-10 max-w-3xl">
                <form onSubmit={handleSubmit} className="bg-cream rounded-2xl shadow-card p-6 sm:p-8 space-y-6">
                    {/* Same form fields as new product page */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Product Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Category *</label>
                        <select
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        >
                            <option value="shampoos">Shampoos</option>
                            <option value="serums">Serums</option>
                            <option value="oils">Oils</option>
                            <option value="sprays">Sprays</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Short Description *</label>
                        <input
                            type="text"
                            required
                            value={formData.shortDescription}
                            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Full Description *</label>
                        <textarea
                            required
                            value={formData.fullDescription}
                            onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Price *</label>
                        <input
                            type="number"
                            required
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="bg-white border border-border rounded-xl p-5">
                        <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-3">Product Images *</label>
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-4">
                                {formData.images.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img src={img} alt={`Product ${index + 1}`} className="w-32 h-32 object-cover rounded-lg border border-border" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 w-7 h-7 grid place-items-center rounded-full border border-destructive/30 bg-white hover:bg-destructive/10 text-destructive shadow-card"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <label className="inline-block">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={uploadingImage}
                                />
                                <span className="inline-flex items-center rounded-full border border-border bg-white hover:bg-cream text-foreground px-4 py-2.5 h-11 text-[11px] uppercase tracking-[0.16em] font-semibold cursor-pointer transition-colors">
                                    <Upload className="w-4 h-4 mr-2" />
                                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-white border border-border rounded-xl p-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.inStock}
                                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                                className="w-4 h-4 accent-accent"
                            />
                            <span className="text-sm font-medium text-foreground">In Stock</span>
                        </label>
                    </div>

                    <div className="bg-white border border-border rounded-xl p-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.bestSeller}
                                onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
                                className="w-4 h-4 accent-accent"
                            />
                            <span className="text-sm font-medium text-foreground">Mark as Best Seller</span>
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">Only products marked as best seller are returned by the best-seller API.</p>
                    </div>

                    {/* Key Benefits */}
                    <div className="bg-white border border-border rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-xs uppercase tracking-wider font-semibold text-primary">Key Benefits</label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="rounded-full border border-border bg-white hover:bg-cream text-foreground text-[11px] uppercase tracking-[0.14em] font-semibold"
                                onClick={() =>
                                    setFormData(prev => ({
                                        ...prev,
                                        keyBenefits: [...prev.keyBenefits, { label: "", icon: benefitIconOptions[0].value }]
                                    }))
                                }
                            >
                                Add Benefit
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {formData.keyBenefits.map((benefit, index) => {
                                const IconComp = benefitIconOptions.find(o => o.value === benefit.icon)?.icon
                                return (
                                    <div key={index} className="flex flex-col gap-2 rounded-lg border border-border bg-ivory/60 p-3">
                                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                            <span>{index + 1})</span>
                                            {IconComp && <IconComp className="w-4 h-4" />}
                                            <span>Benefit</span>
                                        </div>
                                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                                            <select
                                                value={benefit.icon}
                                                onChange={(e) => {
                                                    const next = [...formData.keyBenefits]
                                                    next[index] = { ...next[index], icon: e.target.value }
                                                    setFormData({ ...formData, keyBenefits: next })
                                                }}
                                                className="w-full md:w-48 bg-white border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                            >
                                                {benefitIconOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                value={benefit.label}
                                                onChange={(e) => {
                                                    const next = [...formData.keyBenefits]
                                                    next[index] = { ...next[index], label: e.target.value }
                                                    setFormData({ ...formData, keyBenefits: next })
                                                }}
                                                className="flex-1 bg-white border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                                placeholder="e.g., Deep hydration for dry hair"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="rounded-full border border-destructive/30 bg-white hover:bg-destructive/10 text-destructive text-[11px] uppercase tracking-[0.14em] font-semibold"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        keyBenefits: prev.keyBenefits.filter((_, i) => i !== index)
                                                    }))
                                                }}
                                                disabled={formData.keyBenefits.length === 1}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <p className="text-sm text-muted-foreground mt-3">Choose an icon and add one benefit per row.</p>
                    </div>

                    {/* Direct Checkout */}
                    <div className="bg-white border border-border rounded-xl p-5 space-y-4">
                        <h3 className="text-lg font-display font-bold text-primary">Direct Checkout</h3>
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={formData.directCheckoutEnabled}
                                onChange={(e) => setFormData({ ...formData, directCheckoutEnabled: e.target.checked })}
                                className="w-4 h-4 accent-accent"
                            />
                            <span className="text-sm font-medium text-foreground">Enable Direct Checkout on Auraava</span>
                        </label>
                        <p className="text-sm text-muted-foreground">
                            Shows a &quot;Buy Directly&quot; button on the product page, letting customers check out on-site (cart → checkout → payment) alongside WhatsApp and the dynamic button below.
                        </p>
                    </div>

                    {/* Dynamic Button */}
                    <div className="bg-white border border-border rounded-xl p-5 space-y-4">
                        <h3 className="text-lg font-display font-bold text-primary">Dynamic Button (Optional)</h3>
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Button Text</label>
                            <input
                                type="text"
                                value={formData.buttonText}
                                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                placeholder="e.g., Shop Now, Learn More"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">Button Link</label>
                            <input
                                type="url"
                                value={formData.buttonLink}
                                onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                placeholder="https://example.com"
                            />
                            <p className="text-sm text-muted-foreground mt-1">Button will only show if both text and link are provided</p>
                        </div>
                    </div>

                    {/* WhatsApp Settings */}
                    <div className="bg-white border border-border rounded-xl p-5 space-y-4">
                        <h3 className="text-lg font-display font-bold text-primary">WhatsApp Settings (Optional)</h3>
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">WhatsApp Phone Number</label>
                            <input
                                type="text"
                                value={formData.whatsappPhoneNumber}
                                onChange={(e) => setFormData({ ...formData, whatsappPhoneNumber: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                placeholder="919818024742"
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                                Enter phone number in international format without + or spaces (e.g., 919876543212). If left empty, default will be used.
                            </p>
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">WhatsApp Message Template</label>
                            <textarea
                                value={formData.whatsappMessageTemplate}
                                onChange={(e) => setFormData({ ...formData, whatsappMessageTemplate: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                placeholder="Hi! I'm interested in {productName} - Rs. {price}. Can you provide more details?"
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                                Use {"{productName}"} and {"{price}"} as placeholders. If left empty, default message will be used.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={saving || formData.images.length === 0}
                            className="flex-1 rounded-full bg-primary hover:bg-primary-light text-primary-foreground py-3 h-11 text-[11px] uppercase tracking-[0.16em] font-semibold"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Link href="/admin" className="flex-1">
                            <Button type="button" variant="outline" className="w-full rounded-full border border-border bg-white hover:bg-cream text-foreground py-3 h-11 text-[11px] uppercase tracking-[0.16em] font-semibold">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </main>
        </div>
    )
}

