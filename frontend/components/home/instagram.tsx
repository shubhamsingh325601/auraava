"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Instagram } from "lucide-react";
import { BRAND } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";
import { ShopNowCta } from "@/components/home/shop-now-cta";

interface InstagramPost {
    id: string
    image: string
    link?: string
    order: number
}

export default function InstaGallerySection() {
    const [sectionTitle, setSectionTitle] = useState("Follow Us On Social Media")
    const [sectionSubtitle, setSectionSubtitle] = useState("Join The Auraava Fam")
    const [posts, setPosts] = useState<InstagramPost[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Use requestIdleCallback to defer non-critical work
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                fetchInstagramData()
            }, { timeout: 2000 })
        } else {
            // Fallback for browsers without requestIdleCallback
            setTimeout(() => {
                fetchInstagramData()
            }, 100)
        }
    }, [])

    const fetchInstagramData = async () => {
        try {
            const res = await fetch('/api/instagram')
            const data = await res.json()
            if (data.sectionTitle) setSectionTitle(data.sectionTitle)
            if (data.sectionSubtitle) setSectionSubtitle(data.sectionSubtitle)
            if (data.posts) setPosts(data.posts)
        } catch (error) {
            console.error('Failed to fetch instagram data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return null
    }

    return (
        <section className="section-pad bg-ivory overflow-x-hidden">
            <div className="container-x">
                {/* Heading */}
                <Reveal className="text-center max-w-2xl mx-auto mb-12">
                    <p className="eyebrow text-accent">{sectionSubtitle}</p>
                    <h2 className="mt-3 font-display text-2xl sm:text-3xl md:text-4xl text-primary">
                        {sectionTitle}
                    </h2>
                </Reveal>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {posts.slice(0, 5).map((item) => {
                        const content = (
                            <div className="group relative aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-cream cursor-pointer">
                                <Image
                                    src={item.image}
                                    alt="Social Media Post"
                                    fill
                                    loading="lazy"
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/50 transition flex items-center justify-center">
                                    <Instagram className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition" />
                                </div>
                            </div>
                        )

                        return item.link ? (
                            <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer">
                                {content}
                            </a>
                        ) : (
                            <div key={item.id}>{content}</div>
                        )
                    })}
                    <a
                        href={BRAND.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative aspect-square rounded-xl md:rounded-2xl bg-primary text-primary-foreground grid place-items-center text-center p-6 hover:bg-primary-light transition"
                    >
                        <div>
                            <Instagram className="w-7 h-7 mx-auto" />
                            <p className="mt-3 font-serif text-lg">Follow us</p>
                            <p className="eyebrow text-[10px] opacity-80 mt-1">@auraavacare</p>
                        </div>
                    </a>
                </div>

                <ShopNowCta className="mt-12" />
            </div>
        </section>
    );
}
