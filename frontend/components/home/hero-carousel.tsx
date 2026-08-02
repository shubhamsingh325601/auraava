"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

interface HeroSlide {
    id: string
    image: string
    link: string
}

const FALLBACK_SLIDES: HeroSlide[] = [
    { id: "fallback-1", image: "/images/hero-1.png", link: "/products?category=oils" },
    { id: "fallback-2", image: "/images/hero-2.png", link: "/products" },
    { id: "fallback-3", image: "/images/hero-3.png", link: "/products" },
    { id: "fallback-4", image: "/images/hero-4.png", link: "/products" },
]

export default function HeroCarousel() {
    const [slides, setSlides] = useState<HeroSlide[]>([])
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        let cancelled = false

        const fetchBanners = async () => {
            try {
                const res = await fetch("/api/hero-banners")
                const data = await res.json()
                if (cancelled) return
                const banners = (data.banners || [])
                    .filter((b: { image?: string }) => b.image)
                    .map((b: { id: string; image: string; link: string }) => ({
                        id: b.id,
                        image: b.image,
                        link: b.link || "/products",
                    }))
                setSlides(banners.length > 0 ? banners : FALLBACK_SLIDES)
            } catch (error) {
                console.error("Failed to fetch hero banners:", error)
                if (!cancelled) setSlides(FALLBACK_SLIDES)
            }
        }

        fetchBanners()
        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        if (slides.length === 0) return
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 6000)

        return () => clearInterval(timer)
    }, [slides])

    if (slides.length === 0) {
        return <div className="w-full aspect-[16/9] sm:aspect-[21/9] bg-deep" />
    }

    return (
        <section className="relative w-full overflow-hidden bg-deep text-primary-foreground">
            <Link
                href={slides[currentSlide].link}
                className="relative block w-full aspect-[16/9] sm:aspect-[21/9]"
            >
                <AnimatePresence mode="sync">
                    <motion.div
                        key={slides[currentSlide].id}
                        className="absolute inset-0"
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Image
                            src={slides[currentSlide].image}
                            alt="Auraava — Loved by your hair, nature and forever"
                            fill
                            className="object-cover object-top md:object-center"
                            priority={currentSlide === 0}
                            loading={currentSlide === 0 ? "eager" : "lazy"}
                        />
                    </motion.div>
                </AnimatePresence>
            </Link>

            {/* Slide indicator */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-end">
                <div className="pointer-events-auto flex items-center gap-4 mr-6 mb-6 md:mr-10 md:mb-10">
                    <div className="text-xs tracking-[0.18em] text-white drop-shadow">
                        <span className="font-semibold">{String(currentSlide + 1).padStart(2, "0")}</span>
                        <span className="opacity-70"> / 0{slides.length}</span>
                    </div>
                    <div className="hidden sm:flex w-32 h-px bg-white/30 relative overflow-hidden">
                        <motion.span
                            key={slides[currentSlide].id}
                            className="absolute inset-y-0 left-0 bg-accent-gold"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 6, ease: "linear" }}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {slides.map((slide, idx) => (
                            <button
                                key={slide.id}
                                aria-label={`Slide ${idx + 1}`}
                                onClick={() => setCurrentSlide(idx)}
                                className={`min-h-0 min-w-0 w-1.5 h-1.5 rounded-full transition ${idx === currentSlide ? "bg-accent-gold scale-150" : "bg-white/50"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 bottom-4 md:bottom-6 z-10 hidden md:flex flex-col items-center gap-1 opacity-70 text-white">
                <span className="eyebrow text-[10px]">Scroll</span>
                <motion.span
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown className="w-4 h-4" />
                </motion.span>
            </div>
        </section>
    )
}
