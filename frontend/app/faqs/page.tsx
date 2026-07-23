"use client"

import { useState, useEffect, useMemo } from "react"
import { Plus, Search, X, MessageCircle, Loader2 } from "lucide-react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Newsletter from "@/components/layout/newsletter"
import PageHero from "@/components/layout/page-hero"
import { useSiteContact, useWaLink } from "@/lib/site-config-context"

interface FAQ {
    id: string
    question: string
    answer: string
    order: number
}

export default function FAQsPage() {
    const { phone } = useSiteContact()
    const waLink = useWaLink()
    const [faqs, setFaqs] = useState<FAQ[]>([])
    const [loading, setLoading] = useState(true)
    const [openId, setOpenId] = useState<string | null>(null)
    const [query, setQuery] = useState("")

    useEffect(() => {
        fetchFAQs()
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

    const filteredFaqs = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return faqs
        return faqs.filter(
            (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
        )
    }, [faqs, query])

    return (
        <>
            <Header />

            <main>
                <PageHero
                    eyebrow="Help Centre"
                    title="Frequently Asked Questions"
                    description="We've got answers."
                    breadcrumb={[{ label: "FAQs" }]}
                />

                {/* Search */}
                <section className="bg-cream pt-10 pb-2 text-center">
                    <div className="container-x">
                        <div className="max-w-xl mx-auto relative">
                            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search questions..."
                                className="w-full h-12 pl-11 pr-4 rounded-full bg-white border border-border focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition text-sm"
                            />
                        </div>
                    </div>
                </section>

                {/* FAQ list */}
                <section className="bg-ivory section-pad">
                    <div className="container-x max-w-3xl">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground py-16">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                <span>Loading FAQs...</span>
                            </div>
                        ) : faqs.length === 0 ? (
                            <div className="text-center text-muted-foreground py-16">No FAQs available yet.</div>
                        ) : filteredFaqs.length === 0 ? (
                            <p className="text-center text-muted-foreground py-16">
                                No matching questions. Try a different keyword.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {filteredFaqs.map((faq) => {
                                    const isOpen = openId === faq.id
                                    return (
                                        <div
                                            key={faq.id}
                                            className={`rounded-2xl overflow-hidden transition-all duration-500 ${isOpen
                                                ? "bg-sage border-l-4 border-primary shadow-card"
                                                : "bg-white border-l-4 border-transparent shadow-card"
                                                }`}
                                        >
                                            <button
                                                onClick={() => setOpenId(isOpen ? null : faq.id)}
                                                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                                            >
                                                <span className="font-serif text-lg md:text-xl text-primary">
                                                    {faq.question}
                                                </span>
                                                <span
                                                    className={`w-9 h-9 grid place-items-center rounded-full shrink-0 transition-colors ${isOpen ? "bg-primary text-white" : "bg-cream text-primary"
                                                        }`}
                                                >
                                                    {isOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                                </span>
                                            </button>
                                            <div
                                                className="grid transition-[grid-template-rows] duration-500 ease-out"
                                                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                                            >
                                                <div className="overflow-hidden">
                                                    <p className="px-6 pb-6 text-base text-muted-foreground leading-[1.7]">
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {/* Still have questions */}
                        <div className="mt-16 bg-deep text-primary-foreground rounded-3xl p-10 md:p-14 text-center">
                            <h2 className="font-display text-3xl md:text-4xl">Still have questions?</h2>
                            <p className="mt-3 text-primary-foreground/75 max-w-md mx-auto">
                                Our team is here Monday–Saturday, 10 AM to 7 PM IST. Chat with us on WhatsApp for the fastest reply.
                            </p>
                            <a
                                href={waLink("Hi Auraava, I have a question.")}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-7 inline-flex items-center gap-2 px-7 h-12 rounded-full bg-whatsapp text-white text-[11px] uppercase tracking-[0.18em] font-semibold hover:brightness-110 transition"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Chat on WhatsApp
                            </a>
                            <p className="mt-4 text-xs opacity-70">{phone}</p>
                        </div>
                    </div>
                </section>
            </main>

            <Newsletter />
            <Footer />
        </>
    )
}
