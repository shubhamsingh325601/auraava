"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { ShopNowCta } from "@/components/home/shop-now-cta"

interface HairCareItem {
    id: string
    title: string
    description: string
    image: string
    reverse: boolean
    order: number
}

interface SkinCareSectionProps {
    variant?: "home" | "full"
}

export default function SkinCareSection({ variant = "home" }: SkinCareSectionProps) {
    const [sectionTitle, setSectionTitle] = useState("Hair Care Essentials")
    const [sectionDescription, setSectionDescription] = useState("Indulge in a self-care ritual that nurtures your hair from within — pure, effective, and powered by nature.")
    const [steps, setSteps] = useState<HairCareItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchHairCareData()
    }, [])

    const fetchHairCareData = async () => {
        try {
            const res = await fetch('/api/hair-care')
            const data = await res.json()
            if (data.sectionTitle) setSectionTitle(data.sectionTitle)
            if (data.sectionDescription) setSectionDescription(data.sectionDescription)
            if (data.items) setSteps(data.items)
        } catch (error) {
            console.error('Failed to fetch hair care data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return null
    }
    return (
        <section className="section-pad bg-ivory overflow-hidden">
            <div className="container-x">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                    <p className="eyebrow text-accent">The Auraava Ritual</p>
                    <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl text-primary">
                        {sectionTitle}
                    </h2>
                    <p className="mt-4 text-muted-foreground px-4">
                        {sectionDescription}
                    </p>
                </motion.div>

                {/* Steps */}
                <div className={variant === "full" ? "" : "space-y-16 sm:space-y-20 md:space-y-28"}>
                    {steps.map((step, i) => (
                        <div
                            key={step.id ?? i}
                            className={
                                variant === "full"
                                    ? `${i % 2 === 0 ? "bg-ivory" : "bg-cream"} -mx-[clamp(1.25rem,4vw,2.5rem)] px-[clamp(1.25rem,4vw,2.5rem)] py-16 sm:py-20`
                                    : ""
                            }
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.1 }}
                                viewport={{ once: true }}
                                className={`grid lg:grid-cols-2 gap-10 md:gap-16 items-center ${step.reverse ? "lg:[&>*:first-child]:order-2" : ""
                                    }`}
                            >
                                {/* Image */}
                                <Link
                                    href="/products"
                                    className="group relative block w-full aspect-[4/5] rounded-2xl overflow-hidden bg-cream shadow-card"
                                >
                                    <Image
                                        src={step.image}
                                        alt={step.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-1 px-5 h-11 rounded-full bg-white text-primary text-[11px] font-semibold uppercase tracking-[0.16em] opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
                                        Shop Now <ArrowUpRight className="w-3.5 h-3.5" />
                                    </span>
                                </Link>

                                {/* Text */}
                                <div className="text-center lg:text-left px-4 sm:px-0">
                                    <p className="font-display text-7xl sm:text-8xl md:text-[120px] leading-none text-accent-gold opacity-40 -mb-2 select-none">
                                        {String(i + 1).padStart(2, "0")}
                                    </p>
                                    <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-primary">
                                        {step.title}
                                    </h3>
                                    <p className="mt-5 text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0">
                                        {step.description}
                                    </p>
                                    {variant === "home" && (
                                        <a
                                            href="/hair-care-tips"
                                            className="mt-5 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] font-semibold text-accent hover:gap-2 transition-all"
                                        >
                                            Read more →
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>

                {variant === "home" && <ShopNowCta className="mt-16 sm:mt-20" />}
            </div>
        </section>
    )
}
