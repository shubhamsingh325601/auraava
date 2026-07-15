"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

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
                                <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-cream shadow-card">
                                    <Image
                                        src={step.image}
                                        alt={step.title}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                </div>

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
            </div>
        </section>
    )
}
