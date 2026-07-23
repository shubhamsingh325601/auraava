"use client"

import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Loader2, MessageCircle, Star } from "lucide-react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Newsletter from "@/components/layout/newsletter"
import PageHero from "@/components/layout/page-hero"
import { useWaLink } from "@/lib/site-config-context"

interface Product {
    id: string
    name: string
    category: string
    shortDescription: string
    price: number
    currency: string
    mainImage: string
    inStock: boolean
    rating?: number
    reviews?: number
    bestSeller?: boolean
}

const CATEGORY_LABELS: Record<string, string> = {
    oils: "Hair Oils",
    shampoos: "Shampoos",
    serums: "Hair Serums",
    sprays: "Hair Sprays",
}

const FILTERS: { id: string; label: string }[] = [
    { id: "all", label: "All Products" },
    { id: "oils", label: "Hair Oils" },
    { id: "shampoos", label: "Shampoos" },
    { id: "serums", label: "Hair Serums" },
    { id: "sprays", label: "Hair Sprays" },
]

export default function ProductsPage() {
    return (
        <Suspense fallback={null}>
            <ProductsPageInner />
        </Suspense>
    )
}

function ProductsPageInner() {
    const searchParams = useSearchParams()
    const [products, setProducts] = useState<Product[]>([])
    const [activeFilter, setActiveFilter] = useState("all")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        const category = searchParams.get("category")
        if (category && FILTERS.some((f) => f.id === category)) {
            setActiveFilter(category)
        }
    }, [searchParams])

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

    const filteredProducts = activeFilter === "all" ? products : products.filter((p) => p.category === activeFilter)

    return (
        <div className="min-h-screen bg-ivory">
            <Header />

            <main>
                <PageHero
                    eyebrow="Our Collection"
                    title="Our Products"
                    description="Pure, plant-powered formulations crafted in small batches for hair that glows from root to tip."
                    breadcrumb={[{ label: "Products" }]}
                />

                {/* Filters + grid */}
                <section className="section-pad bg-ivory">
                    <div className="container-x">
                        <div className="flex flex-wrap gap-2 md:gap-3 mb-10 justify-center">
                            {FILTERS.map((f) => {
                                const active = activeFilter === f.id
                                return (
                                    <button
                                        key={f.id}
                                        onClick={() => setActiveFilter(f.id)}
                                        className={`px-5 h-10 rounded-full text-[11px] uppercase tracking-[0.16em] font-semibold border transition-all duration-300 ${active
                                            ? "bg-primary text-primary-foreground border-primary shadow-card"
                                            : "bg-transparent text-primary border-border hover:border-primary"
                                            }`}
                                    >
                                        {f.label}
                                    </button>
                                )
                            })}
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                <span>Loading products...</span>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="flex flex-col items-center text-center py-20">
                                <div className="w-16 h-16 grid place-items-center rounded-full bg-sage text-primary">
                                    <Star className="w-7 h-7" />
                                </div>
                                <h2 className="mt-5 font-serif text-xl text-primary">No products found</h2>
                                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                                    Try a different category filter.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                                {filteredProducts.map((product, i) => (
                                    <ListingCard key={product.id} product={product} index={i} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Newsletter />
            <Footer />
        </div>
    )
}

function ListingCard({ product, index }: { product: Product; index: number }) {
    const waLink = useWaLink()
    const rating = product.rating ?? 0
    const reviews = product.reviews ?? 0
    const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category

    return (
        <article
            className="group relative bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-500 hover:-translate-y-1.5 flex flex-col animate-in fade-in duration-700"
            style={{ animationDelay: `${index * 60}ms` }}
        >
            <Link
                href={`/products/${product.id}`}
                className="relative block aspect-[4/5] bg-cream overflow-hidden"
            >
                <Image
                    src={product.mainImage}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {product.bestSeller && (
                    <div className="absolute top-4 -left-10 rotate-[-35deg] bg-accent-gold text-white text-[10px] uppercase tracking-[0.18em] font-semibold px-12 py-1 shadow-card">
                        ✦ Bestseller
                    </div>
                )}
                {!product.inStock && (
                    <div className="absolute inset-0 bg-black/45 grid place-items-center">
                        <span className="px-4 py-1.5 rounded-full bg-white/95 text-[11px] uppercase tracking-[0.18em] font-semibold text-primary">
                            Out of Stock
                        </span>
                    </div>
                )}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/15 transition-colors duration-500 grid place-items-center">
                    <span className="opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 px-5 h-10 grid place-items-center rounded-full bg-white text-primary text-[11px] uppercase tracking-[0.18em] font-semibold">
                        View Details
                    </span>
                </div>
            </Link>

            <div className="p-5 flex flex-col flex-1">
                <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">
                    {categoryLabel}
                </span>
                <h3 className="mt-1.5 font-serif text-[18px] leading-tight text-primary">
                    {product.name}
                </h3>
                <p className="mt-1.5 text-[13px] text-muted-foreground line-clamp-2">
                    {product.shortDescription}
                </p>
                <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center gap-0.5 text-accent-gold">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(rating) ? "fill-current" : "opacity-30"}`} />
                        ))}
                    </div>
                    <span className="text-[11px] text-muted-foreground">({reviews})</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                    <span className="font-semibold text-[18px] text-accent-gold">
                        Rs. {product.price.toFixed(2)}
                    </span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <Link
                        href={`/products/${product.id}`}
                        className="flex-1 h-10 grid place-items-center rounded-full border border-primary text-primary text-[10px] uppercase tracking-[0.18em] font-semibold hover:bg-primary hover:text-primary-foreground transition"
                    >
                        View Details
                    </Link>
                    <a
                        aria-label={`Enquire about ${product.name} on WhatsApp`}
                        href={waLink(`Hi Auraava, I'm interested in ${product.name}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 grid place-items-center rounded-full bg-whatsapp text-white hover:brightness-110 transition shrink-0"
                    >
                        <MessageCircle className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </article>
    )
}
