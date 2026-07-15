"use client"

import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Newsletter from "@/components/layout/newsletter"
import PageHero from "@/components/layout/page-hero"
import SkinCareSection from "@/components/home/skin-care-tips"

export default function HairCareTipsPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <PageHero
                eyebrow="The Auraava Guide"
                title="Hair Care Essentials"
                description="Six timeless rituals — from the wisdom of Ayurveda to modern quiet luxury — for hair that feels as good as it looks."
                breadcrumb={[{ label: "Hair Care Tips" }]}
            />

            <main>
                <SkinCareSection variant="full" />
            </main>
            <Newsletter />
            <Footer />
        </div>
    )
}

