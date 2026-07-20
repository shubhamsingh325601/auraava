"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Star } from "lucide-react"
import { ShopNowCta } from "@/components/home/shop-now-cta"

interface Testimonial {
  id: string
  text: string
  author: string
  rating: number
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    // Use requestIdleCallback to defer non-critical work
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        fetchTestimonials()
      }, { timeout: 2000 })
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        fetchTestimonials()
      }, 100)
    }
  }, [])

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials')
      const data = await res.json()
      setTestimonials(data.testimonials || [])
    } catch (error) {
      console.error('Failed to fetch testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (testimonials.length === 0) return
    const t = setInterval(() => setCurrent((p) => (p + 1) % testimonials.length), 6500)
    return () => clearInterval(t)
  }, [testimonials.length])

  if (loading) {
    return (
      <section id="testimonials" className="section-pad bg-deep text-primary-foreground">
        <div className="container-x text-center">
          <p className="eyebrow text-accent-blush">Love letters</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl">Words of Love</h2>
          <div className="mt-10 text-primary-foreground/70">Loading testimonials...</div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return null
  }

  const testimonial = testimonials[current]

  return (
    <section id="testimonials" className="section-pad bg-deep text-primary-foreground relative overflow-hidden">
      <span aria-hidden className="absolute -left-20 top-10 text-[280px] opacity-[0.04] select-none">🌿</span>
      <span aria-hidden className="absolute -right-20 bottom-10 text-[280px] opacity-[0.04] select-none">🌿</span>

      <div className="container-x relative">
        <div className="text-center max-w-3xl mx-auto">
          <p className="eyebrow text-accent-blush">Love letters</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl">What Our Customers Say</h2>
        </div>

        <div className="relative mt-14 max-w-3xl mx-auto min-h-[260px]">
          <span aria-hidden className="absolute -top-6 left-1/2 -translate-x-1/2 font-display text-[120px] sm:text-[180px] leading-none text-accent-gold/30 select-none">
            &rdquo;
          </span>
          <AnimatePresence mode="wait">
            <motion.figure
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7 }}
              className="relative text-center pt-10"
            >
              <blockquote className="font-display italic text-xl sm:text-2xl md:text-3xl leading-relaxed text-primary-foreground/95">
                &ldquo;{testimonial.text}&rdquo;
              </blockquote>
              <figcaption className="mt-8">
                <div className="flex justify-center gap-0.5 text-accent-gold mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? "fill-current" : "opacity-30"}`} />
                  ))}
                </div>
                <p className="text-sm uppercase tracking-[0.2em] opacity-80">{testimonial.author}</p>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex justify-center gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Quote ${idx + 1}`}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === current ? "w-8 bg-accent-gold" : "w-1.5 bg-white/30"}`}
            />
          ))}
        </div>

        <ShopNowCta variant="dark" className="mt-12" />
      </div>
    </section>
  )
}


