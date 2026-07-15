"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Plus, X, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Reveal } from "@/components/reveal"

interface FAQ {
  id: string
  question: string
  answer: string
  order: number
}

export default function FAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    // Use requestIdleCallback to defer non-critical work
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        fetchFAQs()
      }, { timeout: 2000 })
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        fetchFAQs()
      }, 100)
    }
  }, [])

  const fetchFAQs = async () => {
    try {
      const res = await fetch('/api/faqs')
      const data = await res.json()
      setFaqs(data.faqs || [])
    } catch (error) {
      console.error('Failed to fetch FAQs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section id="faqs" className="section-pad bg-ivory">
        <div className="container-x text-center">
          <p className="eyebrow text-accent">Help</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl text-primary">Frequently Asked Questions</h2>
          <div className="mt-10 text-muted-foreground">Loading FAQs...</div>
        </div>
      </section>
    )
  }

  if (faqs.length === 0) {
    return null
  }

  return (
    <section id="faqs" className="section-pad bg-ivory">
      <div className="container-x grid md:grid-cols-2 gap-12 md:gap-20 items-start">
        <Reveal className="md:sticky md:top-32">
          <p className="eyebrow text-accent">Help</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl text-primary">
            Frequently asked, beautifully answered.
          </h2>
          <p className="mt-5 text-muted-foreground max-w-md">
            Everything you&apos;d want to know about our rituals, ingredients and shipping.
          </p>
          <Link
            href="/faqs"
            className="mt-7 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-semibold text-accent"
          >
            See all FAQs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Reveal>

        <Reveal delay={0.1} className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id
            return (
              <div
                key={faq.id}
                className={`bg-white rounded-2xl shadow-card overflow-hidden transition ${isOpen ? "border-l-4 border-accent" : ""
                  }`}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left min-h-[44px]"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg md:text-xl text-primary">{faq.question}</span>
                  <span className="w-8 h-8 rounded-full grid place-items-center bg-cream text-primary shrink-0">
                    {isOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="px-5 md:px-6 pb-6 text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}

