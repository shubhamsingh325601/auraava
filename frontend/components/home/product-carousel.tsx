"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { useWaLink } from "@/lib/site-config-context"

interface Product {
    id: string
    name: string
    category: string
    shortDescription: string
    price: number
    currency: string
    mainImage: string
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

interface ProductCarouselProps {
    eyebrowText?: string
    heading?: string
    subtitle?: string
    bgClassName?: string
    excludeId?: string
}

export default function ProductCarousel({
    eyebrowText = "Loved by you",
    heading = "Our Bestsellers",
    subtitle = "Crafted with love, backed by science.",
    bgClassName = "bg-sage",
    excludeId,
}: ProductCarouselProps) {
    const waLink = useWaLink()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Use requestIdleCallback to defer non-critical work
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                fetchProducts()
            }, { timeout: 2000 })
        } else {
            // Fallback for browsers without requestIdleCallback
            setTimeout(() => {
                fetchProducts()
            }, 100)
        }
    }, [])

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products/best-sellers')
            const data = await res.json()
            setProducts(data.products || [])
        } catch (error) {
            console.error('Failed to fetch products:', error)
        } finally {
            setLoading(false)
        }
    }

    const visibleProducts = excludeId ? products.filter((p) => p.id !== excludeId) : products

    if (loading) {
        return (
            <section id="products" className={`section-pad ${bgClassName}`}>
                <div className="container-x">
                    <div className="text-center max-w-2xl mx-auto">
                        <p className="eyebrow text-accent">{eyebrowText}</p>
                        <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl text-primary">{heading}</h2>
                        <p className="mt-3 text-muted-foreground">{subtitle}</p>
                    </div>
                    <div className="mt-10 text-center text-muted-foreground">Loading bestsellers...</div>
                </div>
            </section>
        )
    }

    if (visibleProducts.length === 0) {
        return (
            <section id="products" className={`section-pad ${bgClassName}`}>
                <div className="container-x">
                    <div className="text-center max-w-2xl mx-auto">
                        <p className="eyebrow text-accent">{eyebrowText}</p>
                        <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl text-primary">{heading}</h2>
                        <p className="mt-3 text-muted-foreground">{subtitle}</p>
                    </div>
                    <div className="mt-10 text-center text-muted-foreground">No products available yet.</div>
                </div>
            </section>
        )
    }

    return (
        <section id="products" className={`section-pad ${bgClassName}`}>
            <div className="container-x">
                <Carousel
                    opts={{
                        align: "start",
                        loop: false,
                        dragFree: true,
                    }}
                    className="w-full"
                >
                    <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
                        <div>
                            <p className="eyebrow text-accent">{eyebrowText}</p>
                            <h2 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl text-primary">{heading}</h2>
                            <p className="mt-3 text-muted-foreground max-w-md">{subtitle}</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <CarouselPrevious className="static translate-y-0 h-11 w-11 bg-white text-primary shadow-card hover:bg-primary hover:text-white disabled:opacity-40" />
                            <CarouselNext className="static translate-y-0 h-11 w-11 bg-white text-primary shadow-card hover:bg-primary hover:text-white disabled:opacity-40" />
                        </div>
                    </div>

                    <CarouselContent>
                        {visibleProducts.map((product) => {
                            const rating = product.rating ?? 0
                            const reviews = product.reviews ?? 0
                            const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category

                            return (
                                <CarouselItem key={product.id} className="basis-[80%] sm:basis-[48%] lg:basis-[31%] xl:basis-[24%]">
                                    <article className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all hover:-translate-y-1.5 duration-500 h-full flex flex-col">
                                        <Link href={`/products/${product.id}`} className="relative aspect-square bg-cream block overflow-hidden">
                                            <Image
                                                src={product.mainImage}
                                                alt={product.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                            {categoryLabel && (
                                                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-sage/90 backdrop-blur text-[10px] uppercase tracking-[0.14em] font-semibold text-primary">
                                                    {categoryLabel}
                                                </span>
                                            )}
                                            {product.bestSeller && (
                                                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-accent-gold text-white text-[10px] uppercase tracking-[0.14em] font-semibold">
                                                    ✦ Bestseller
                                                </span>
                                            )}
                                        </Link>
                                        <div className="p-5 flex-1 flex flex-col text-left">
                                            <Link href={`/products/${product.id}`}>
                                                <h3 className="font-serif text-lg leading-tight text-primary">{product.name}</h3>
                                            </Link>
                                            <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 flex-1">
                                                {product.shortDescription}
                                            </p>
                                            <div className="mt-3 flex items-center gap-2">
                                                <div className="flex items-center gap-0.5 text-accent-gold">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star key={i} className={`w-3 h-3 ${i < Math.round(rating) ? "fill-current" : "opacity-30"}`} />
                                                    ))}
                                                </div>
                                                <span className="text-[11px] text-muted-foreground">({reviews})</span>
                                            </div>
                                            <div className="mt-3 flex items-center justify-between">
                                                <span className="font-semibold text-accent-gold text-lg">
                                                    Rs. {product.price.toFixed(2)}
                                                </span>
                                                <a
                                                    aria-label={`Enquire about ${product.name} on WhatsApp`}
                                                    href={waLink(`Hi Auraava, I'm interested in ${product.name}.`)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[10px] uppercase tracking-[0.16em] font-semibold px-3.5 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition"
                                                >
                                                    Enquire
                                                </a>
                                            </div>
                                        </div>
                                    </article>
                                </CarouselItem>
                            )
                        })}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    )
}

