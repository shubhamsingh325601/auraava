"use client"

import { useEffect, useState } from "react"
import InstaGallerySection from "@/components/home/instagram";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Newsletter from "@/components/layout/newsletter";
import Image from "next/image";
import { Mail, Phone, MessageCircle, Loader2 } from "lucide-react";
import { BRAND, waLink } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";
import PageHero from "@/components/layout/page-hero";

interface AboutUsSection {
    id: string
    title: string
    subtitle?: string
    content: string
    image: string
    backgroundColor: string
    textColor: string
    layout: 'text-left' | 'text-right'
    order: number
}

export default function AboutUsPage() {
    const [sections, setSections] = useState<AboutUsSection[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAboutUsData()
    }, [])

    const fetchAboutUsData = async () => {
        try {
            const res = await fetch('/api/about-us')
            const data = await res.json()
            if (data.sections) {
                setSections(data.sections)
            }
        } catch (error) {
            console.error('Failed to fetch about-us data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <span>Loading...</span>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />

            <PageHero
                eyebrow="Our Story"
                title="Our Story"
                description="Born from nature. Built for you."
                breadcrumb={[{ label: "About Us" }]}
            />

            {/* Dynamic sections (CMS-driven) */}
            {sections.map((section) => (
                <section
                    key={section.id}
                    className="section-pad"
                    style={{ backgroundColor: section.backgroundColor, color: section.textColor }}
                >
                    <div className="container-x">
                        <Reveal
                            className={`grid lg:grid-cols-2 gap-10 md:gap-16 items-center ${section.layout === 'text-left' ? 'lg:[&>*:first-child]:order-2' : ''
                                }`}
                        >
                            {/* IMAGE */}
                            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-cream shadow-card">
                                <Image
                                    src={section.image}
                                    alt={section.title}
                                    fill
                                    sizes="(min-width: 1024px) 50vw, 100vw"
                                    className="object-cover"
                                />
                            </div>

                            {/* TEXT */}
                            <div>
                                {section.subtitle && (
                                    <p className="eyebrow opacity-80">{section.subtitle}</p>
                                )}
                                <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl leading-tight">
                                    {section.title}
                                </h2>
                                <div
                                    className="mt-5 text-base md:text-lg leading-[1.85] max-w-lg opacity-90"
                                    dangerouslySetInnerHTML={{
                                        __html: section.content.replace(/\n/g, '<br />')
                                    }}
                                />
                            </div>
                        </Reveal>
                    </div>
                </section>
            ))}

            <InstaGallerySection />

            {/* Contact */}
            <section className="section-pad bg-cream">
                <div className="container-x">
                    <Reveal className="text-center max-w-2xl mx-auto mb-12">
                        <p className="eyebrow text-accent">Get in Touch</p>
                        <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl text-primary">
                            We&apos;d love to hear from you
                        </h2>
                    </Reveal>
                    <div className="grid md:grid-cols-3 gap-6">
                        <ContactCard
                            icon={<Phone className="w-6 h-6" />}
                            label="Call us"
                            primary={BRAND.phone}
                            secondary={BRAND.hours}
                            href={`tel:${BRAND.phone.replace(/\s/g, "")}`}
                            cta="Call now"
                        />
                        <ContactCard
                            icon={<Mail className="w-6 h-6" />}
                            label="Email us"
                            primary={BRAND.emails[0]}
                            secondary="We reply within 24 hours"
                            href={`mailto:${BRAND.emails[0]}`}
                            cta="Send email"
                        />
                        <ContactCard
                            icon={<MessageCircle className="w-6 h-6" />}
                            label="WhatsApp"
                            primary={BRAND.phone}
                            secondary="Fastest way to reach us"
                            href={waLink("Hi Auraava, I'd like to know more.")}
                            cta="Chat now"
                            highlight
                        />
                    </div>
                </div>
            </section>

            <Newsletter />
            <Footer />
        </>
    );
}

function ContactCard({
    icon,
    label,
    primary,
    secondary,
    href,
    cta,
    highlight,
}: {
    icon: React.ReactNode;
    label: string;
    primary: string;
    secondary: string;
    href: string;
    cta: string;
    highlight?: boolean;
}) {
    return (
        <div className="bg-white rounded-2xl p-8 shadow-card hover:shadow-hover transition-all duration-500 hover:-translate-y-1 flex flex-col text-center items-center">
            <div
                className={`w-14 h-14 rounded-full grid place-items-center ${highlight ? "bg-whatsapp text-white" : "bg-sage text-primary"
                    }`}
            >
                {icon}
            </div>
            <p className="mt-5 eyebrow text-accent">{label}</p>
            <p className="mt-2 font-serif text-xl text-primary">{primary}</p>
            <p className="mt-1 text-sm text-muted-foreground">{secondary}</p>
            <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`mt-6 inline-flex items-center justify-center px-6 h-11 rounded-full text-[11px] uppercase tracking-[0.18em] font-semibold transition ${highlight
                    ? "bg-whatsapp text-white hover:brightness-110"
                    : "bg-primary text-white hover:bg-primary-light"
                    }`}
            >
                {cta}
            </a>
        </div>
    );
}
