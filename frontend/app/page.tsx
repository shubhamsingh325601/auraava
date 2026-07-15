import dynamic from "next/dynamic"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Newsletter from "@/components/layout/newsletter"
import HeroCarousel from "@/components/home/hero-carousel"
import { TrustBar } from "@/components/home/trust-bar"
import Categories from "@/components/home/categories"
import SpecialOffer from "@/components/home/special-offer"
import type { Metadata } from "next"

// Dynamically import below-the-fold components to improve INP
const ProductCarousel = dynamic(() => import("@/components/home/product-carousel"), {
    ssr: true,
})
const SkinCareSection = dynamic(() => import("@/components/home/skin-care-tips"), {
    ssr: true,
})
const Testimonials = dynamic(() => import("@/components/home/testimonials"), {
    ssr: true,
})
const InstaGallerySection = dynamic(() => import("@/components/home/instagram"), {
    ssr: true,
})
const FAQs = dynamic(() => import("@/components/home/faqs"), {
    ssr: true,
})
const StatsSection = dynamic(() => import("@/components/home/stats"), {
    ssr: true,
})

export const metadata: Metadata = {
    title: "Auraava - Natural Hair Care Products",
    description: "Natural hair care products with pure ingredients. Organic, cruelty-free shampoos, oils, serums, and sprays for radiant hair.",
    alternates: {
        canonical: '/',
    },
}

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background overflow-x-hidden w-full">
            <Header />
            <main className="overflow-x-hidden w-full">
                <h1 className="sr-only">Auraava - Natural Hair Care Products</h1>
                <HeroCarousel />
                <TrustBar />
                <Categories />
                <SpecialOffer />
                <ProductCarousel />
                <SkinCareSection />
                <Testimonials />
                <InstaGallerySection />
                <StatsSection />
                <FAQs />
            </main>
            <Newsletter />
            <Footer />
        </div>
    )
}