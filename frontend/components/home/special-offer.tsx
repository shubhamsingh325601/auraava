"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import DOMPurify from "isomorphic-dompurify"
import { Reveal } from "@/components/reveal"

interface OfferItem {
    id: string
    title: string
    description: string
    image: string
    discount: string
    link: string
}

const BAND_COLOR = "bg-cream"

export default function SpecialOffers() {
    const [sectionTitle, setSectionTitle] = useState("✨ Mega Sale Week ✨")
    const [sectionSubtitle, setSectionSubtitle] = useState("Get up to <span class=\"font-bold\">50% off</span> on your favorite hair care bundles.<br/>Limited time offers on Auraava bestsellers!")
    const [offers, setOffers] = useState<OfferItem[]>([])
    const [isVisible, setIsVisible] = useState(true)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Use requestIdleCallback to defer non-critical work
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                fetchOffersData()
            }, { timeout: 2000 })
        } else {
            // Fallback for browsers without requestIdleCallback
            setTimeout(() => {
                fetchOffersData()
            }, 100)
        }
    }, [])

    const fetchOffersData = async () => {
        try {
            const res = await fetch('/api/offers')
            const data = await res.json()
            if (data.sectionTitle) setSectionTitle(data.sectionTitle)
            if (data.sectionSubtitle) setSectionSubtitle(data.sectionSubtitle)
            if (data.offers) setOffers(data.offers)
            setIsVisible(data.isVisible !== false)
        } catch (error) {
            console.error('Failed to fetch offers data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading || !isVisible || offers.length === 0) {
        return null
    }

    return (
        <section className="relative overflow-x-hidden section-pad bg-deep text-primary-foreground grain">
            <div className="relative z-10 container-x text-center">
                {/* Heading */}
                <Reveal>
                    <p className="eyebrow text-accent-blush">Exclusive</p>
                    <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl px-4">
                        {sectionTitle}
                    </h2>
                </Reveal>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-5 max-w-xl mx-auto text-sm sm:text-base md:text-lg opacity-85 font-light px-4"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(sectionSubtitle, {
                            ALLOWED_TAGS: ['span', 'br', 'b', 'strong', 'em', 'i'],
                            ALLOWED_ATTR: ['class'],
                        }),
                    }}
                />

                {/* Offer Cards */}
                <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto text-left">
                    {offers.map((offer, i) => (
                        <Reveal key={offer.id} delay={i * 0.08} className="h-full">
                            <article className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-shadow bg-ivory text-foreground h-full flex flex-col">
                                <div className="relative aspect-[5/4] overflow-hidden bg-cream">
                                    <Image
                                        src={offer.image}
                                        alt={offer.title}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    <span className="absolute top-4 right-4 w-16 h-16 rounded-full bg-accent-gold text-white text-xs font-semibold grid place-items-center text-center leading-tight shadow-md">
                                        {offer.discount}
                                    </span>
                                </div>
                                <div className={`p-6 flex flex-col flex-1 ${BAND_COLOR}`}>
                                    <h3 className="font-serif text-xl text-primary">{offer.title}</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">{offer.description}</p>
                                    <Link
                                        href={offer.link || "/shop"}
                                        className="mt-auto inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] font-semibold text-accent hover:gap-2 transition-all min-h-[44px]"
                                    >
                                        Shop now
                                    </Link>
                                </div>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    )
}
