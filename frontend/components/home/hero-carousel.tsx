"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

const slides = [
    { image: "/images/hero-1.png", href: "/products?category=oils" },
    { image: "/images/hero-2.png", href: "/products" },
    { image: "/images/hero-3.png", href: "/products" },
    { image: "/images/hero-4.png", href: "/products" },
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
        <section className="relative w-full overflow-hidden bg-deep text-primary-foreground">
            <Link
                href={slides[currentSlide].href}
                className="relative block w-full aspect-[16/9] sm:aspect-[16/7]"
            >
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
                            alt="Auraava — Loved by your hair, nature and forever"
                            fill
                            className="object-cover"
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
