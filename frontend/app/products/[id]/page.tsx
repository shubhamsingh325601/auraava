"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { Leaf, Rabbit, ShieldCheck } from "lucide-react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Newsletter from "@/components/layout/newsletter"
import Breadcrumb from "@/components/product/breadcrumb"
import ProductGallery from "@/components/product/product-gallery"
import ProductDetails from "@/components/product/product-details"
import ProductDescription from "@/components/product/product-description"
import Productcarousael from '@/components/home/product-carousel'
import ProductTestimonials from '@/components/product/product-testimonials'

interface Product {
    id: string
    name: string
    category: string
    shortDescription: string
    fullDescription: string
    price: number
    currency: string
    images: string[]
    mainImage?: string
    rating: number
    reviews: number
    inStock: boolean
    keyBenefits?: { label: string; icon: string }[]
    bestSeller?: boolean
    buttonText?: string
    buttonLink?: string
    whatsappPhoneNumber?: string
    whatsappMessageTemplate?: string
    directCheckoutEnabled?: boolean
}

const TRUST_BADGES = [
    { icon: Leaf, label: "Natural" },
    { icon: Rabbit, label: "Cruelty-Free" },
    { icon: ShieldCheck, label: "Quality Assured" },
]

export default function ProductPage({ params }: { params: { id: string } }) {
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProduct()
    }, [])

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/products/${params.id}`)
            if (!res.ok) {
                notFound()
                return
            }
            const data = await res.json()
            setProduct(data.product)
        } catch (error) {
            console.error('Failed to fetch product:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-ivory">
                <Header />
                <div className="container-x py-32 text-center">
                    <div className="text-muted-foreground">Loading product...</div>
                </div>
                <Footer />
            </div>
        )
    }

    if (!product) {
        notFound()
        return null
    }

    const breadcrumbItems = [
        { label: "Products", href: "/products" },
        { label: product.name },
    ]

    return (
        <div className="min-h-screen bg-ivory">
            <Header />
            <Breadcrumb items={breadcrumbItems} />

            <main>
                <section className="section-pad bg-ivory">
                    <div className="container-x grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-10 lg:gap-16">
                        {/* Gallery */}
                        <ProductGallery images={product.images} productName={product.name} bestSeller={product.bestSeller} />

                        {/* Info */}
                        <div>
                            <ProductDetails
                                productId={product.id}
                                mainImage={product.mainImage || product.images?.[0]}
                                name={product.name}
                                description={product.shortDescription}
                                price={product.price}
                                category={product.category}
                                rating={product.rating}
                                reviews={product.reviews}
                                keyBenefits={product.keyBenefits}
                                buttonText={product.buttonText}
                                buttonLink={product.buttonLink}
                                whatsappPhoneNumber={product.whatsappPhoneNumber}
                                whatsappMessageTemplate={product.whatsappMessageTemplate}
                                directCheckoutEnabled={product.directCheckoutEnabled}
                            />

                            {/* Trust badges */}
                            <div className="mt-5 flex flex-wrap gap-2">
                                {TRUST_BADGES.map(({ icon: Icon, label }) => (
                                    <span
                                        key={label}
                                        className="inline-flex items-center gap-2 px-4 h-9 rounded-full bg-cream text-primary text-[11px] uppercase tracking-[0.16em] font-semibold"
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        {label}
                                    </span>
                                ))}
                            </div>

                            {/* Full Description / How to Use */}
                            <div className="mt-8">
                                <ProductDescription fullDescription={product.fullDescription} />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <ProductTestimonials />

            <Productcarousael
                eyebrowText="More to love"
                heading="You May Also Like"
                subtitle="More favourites picked for your hair care ritual."
                bgClassName="bg-cream"
                excludeId={product.id}
            />

            <Newsletter />
            <Footer />
        </div>
    )
}
