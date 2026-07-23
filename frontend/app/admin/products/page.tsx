"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import ProtectedRoute from "@/components/auth/protected-route"
import { AdminPageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Package, Plus, Edit, Trash2, MessageCircle, Loader2 } from "lucide-react"

interface Product {
    id: string
    name: string
    category: string
    price: number
    inStock: boolean
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products')
            const data = await res.json()
            setProducts(data.products || [])
        } catch (error) {
            console.error('Failed to fetch products:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return

        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setProducts(prev => prev.filter(p => p.id !== id))
            } else {
                alert('Failed to delete product')
            }
        } catch (error) {
            console.error('Failed to delete product:', error)
            alert('Failed to delete product')
        }
    }

    const handleWhatsAppClick = (product: Product) => {
        const phoneNumber = "919818024742"
        const message = `Hi! I'm interested in ${product.name} - Rs. ${product.price}. Can you provide more details?`
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-ivory">
                <AdminPageHeader
                    icon={Package}
                    eyebrow="Catalog"
                    title={`Products${loading ? '' : ` (${products.length})`}`}
                    actions={
                        <Link href="/admin/products/new">
                            <Button className="rounded-full bg-primary hover:bg-primary-light text-primary-foreground flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] font-semibold">
                                <Plus className="w-4 h-4" />
                                Add Product
                            </Button>
                        </Link>
                    }
                />

                <main className="container-x py-10">
                    <div className="bg-cream rounded-2xl shadow-card p-6">
                        {loading ? (
                            <div className="flex items-center justify-center gap-3 text-muted-foreground py-12">
                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                <span>Loading products...</span>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {products.map((product) => (
                                    <div key={product.id} className="flex items-center justify-between p-4 bg-white border border-border rounded-xl">
                                        <div>
                                            <p className="font-semibold text-foreground">{product.name}</p>
                                            <p className="text-sm text-muted-foreground mt-0.5">
                                                {product.category} • Rs.{product.price} •{' '}
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide font-semibold ${product.inStock ? 'bg-primary-soft text-primary' : 'bg-destructive/10 text-destructive'}`}>
                                                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => handleWhatsAppClick(product)}
                                                className="rounded-full bg-whatsapp hover:bg-whatsapp/90 text-white"
                                                title="Open WhatsApp with product details"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                            </Button>
                                            <Link href={`/admin/products/${product.id}`}>
                                                <Button size="sm" className="rounded-full border border-border bg-white hover:bg-cream text-foreground">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                onClick={() => handleDelete(product.id)}
                                                className="rounded-full border border-destructive/30 bg-white hover:bg-destructive/10 text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {products.length === 0 && (
                                    <p className="text-muted-foreground text-center py-4">No products yet</p>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    )
}
