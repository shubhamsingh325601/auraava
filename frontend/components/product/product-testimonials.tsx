"use client"

import { useEffect, useState } from "react"
import { Star, Quote } from "lucide-react"

interface Testimonial {
    id: string
    text: string
    author: string
    rating: number
}

export default function ProductTestimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/testimonials")
            .then((res) => res.json())
            .then((data) => setTestimonials(data.testimonials || []))
            .catch((error) => console.error("Failed to fetch testimonials:", error))
            .finally(() => setLoading(false))
    }, [])

    if (loading || testimonials.length === 0) {
        return null
    }

    // Keep an incomplete last row centered instead of left-aligned with a gap.
    const gridWidth =
        testimonials.length === 1 ? "max-w-sm" : testimonials.length === 2 ? "max-w-3xl" : "max-w-6xl"

    return (
        <section className="section-pad bg-cream">
            <div className="container-x">
                <div className="text-center max-w-2xl mx-auto">
                    <p className="eyebrow text-accent">Love letters</p>
                    <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl text-primary">
                        What Our Customers Say
                    </h2>
                </div>

                <div className={`mt-12 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${gridWidth}`}>
                    {testimonials.map((testimonial) => (
                        <figure
                            key={testimonial.id}
                            className="relative bg-white rounded-2xl shadow-card p-6 flex flex-col"
                        >
                            <Quote className="w-7 h-7 text-accent-gold/40" />
                            <blockquote className="mt-4 text-sm text-foreground leading-relaxed flex-1">
                                &ldquo;{testimonial.text}&rdquo;
                            </blockquote>
                            <figcaption className="mt-5 pt-5 border-t border-border">
                                <div className="flex items-center gap-0.5 text-accent-gold mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-3.5 h-3.5 ${i < testimonial.rating ? "fill-current" : "opacity-30"}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-primary">
                                    {testimonial.author}
                                </p>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    )
}
