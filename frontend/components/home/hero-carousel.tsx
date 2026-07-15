"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

const slides = [
    {
        eyebrow: "Bestseller",
        title: "Nature's Secret\nfor Radiant Hair",
        sub: "Cold-pressed oils, infused with Ayurvedic herbs — for hair that shines from root to tip.",
        image: "/images/hero-1.jpg",
        cta: { label: "Shop Hair Oils", href: "/products?category=oils" },
    },
    {
        eyebrow: "New Arrival",
        title: "Cleanse. Nourish.\nRevitalize.",
        sub: "Sulphate-free, plant-based shampoos that respect your scalp and the planet.",
        image: "/images/hero-2.jpg",
        cta: { label: "Explore Shampoos", href: "/products?category=shampoos" },
    },
    {
        eyebrow: "Bestseller",
        title: "Transform Your Hair.\nNaturally.",
        sub: "Lightweight serums with rose, jojoba & vitamin E for a luminous, frizz-free finish.",
        image: "/images/hero-3.jpg",
        cta: { label: "Discover Serums", href: "/products?category=serums" },
    },
]

export default function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 6000)

        return () => clearInterval(timer)
    }, [])

    return (
        <section className="relative h-screen min-h-[640px] w-full overflow-hidden bg-deep text-primary-foreground">
            <AnimatePresence mode="sync">
                <motion.div
                    key={currentSlide}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Image
                        src={slides[currentSlide].image}
                        alt=""
                        fill
                        className="object-cover"
                        priority={currentSlide === 0}
                        loading={currentSlide === 0 ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/40 to-black/20" />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 grain pointer-events-none" />

            <div className="relative z-10 h-full container-x flex items-end md:items-center pb-32 md:pb-0 pt-32">
                <div className="max-w-2xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <p className="eyebrow text-accent-blush">{slides[currentSlide].eyebrow}</p>
                            <h1 className="mt-5 font-display font-bold leading-[0.98] text-[44px] sm:text-6xl md:text-7xl lg:text-[88px] whitespace-pre-line">
                                {slides[currentSlide].title}
                            </h1>
                            <p className="mt-6 max-w-lg text-base md:text-lg opacity-85 font-light">
                                {slides[currentSlide].sub}
                            </p>
                            <div className="mt-9 flex flex-wrap items-center gap-3">
                                <Link
                                    href={slides[currentSlide].cta.href}
                                    className="inline-flex items-center gap-2 px-7 h-12 rounded-full bg-primary-foreground text-primary text-[11px] font-semibold uppercase tracking-[0.16em] hover:bg-accent-gold hover:text-deep transition min-h-[44px]"
                                >
                                    {slides[currentSlide].cta.label}
                                </Link>
                                <Link
                                    href="/about-us"
                                    className="inline-flex items-center gap-2 px-7 h-12 rounded-full border border-white/70 text-white text-[11px] font-semibold uppercase tracking-[0.16em] hover:bg-white/10 transition min-h-[44px]"
                                >
                                    Our Story
                                </Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Slide indicator */}
            <div className="absolute right-6 md:right-10 bottom-10 z-10 flex items-center gap-4">
                <div className="text-xs tracking-[0.18em]">
                    <span className="font-semibold">{String(currentSlide + 1).padStart(2, "0")}</span>
                    <span className="opacity-50"> / 0{slides.length}</span>
                </div>
                <div className="hidden sm:flex w-32 h-px bg-white/20 relative overflow-hidden">
                    <motion.span
                        key={currentSlide}
                        className="absolute inset-y-0 left-0 bg-accent-gold"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 6, ease: "linear" }}
                    />
                </div>
                <div className="flex items-center gap-2">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            aria-label={`Slide ${idx + 1}`}
                            onClick={() => setCurrentSlide(idx)}
                            className={`min-h-0 min-w-0 w-1.5 h-1.5 rounded-full transition ${idx === currentSlide ? "bg-accent-gold scale-150" : "bg-white/40"
                                }`}
                        />
                    ))}
                </div>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 bottom-6 z-10 hidden md:flex flex-col items-center gap-1 opacity-70">
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
