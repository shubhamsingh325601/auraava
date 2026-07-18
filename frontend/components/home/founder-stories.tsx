"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Instagram, Linkedin, Quote } from "lucide-react";
import { Reveal } from "@/components/reveal";

interface FounderStory {
    id: string
    name: string
    role: string
    photo: string
    quote: string
    story: string
    instagram?: string
    linkedin?: string
    order: number
}

export default function FounderStoriesSection() {
    const [stories, setStories] = useState<FounderStory[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStories()
    }, [])

    const fetchStories = async () => {
        try {
            const res = await fetch('/api/founder-stories')
            const data = await res.json()
            if (data.stories) setStories(data.stories)
        } catch (error) {
            console.error('Failed to fetch founder stories:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading || stories.length === 0) {
        return null
    }

    return (
        <section className="section-pad bg-cream">
            <div className="container-x">
                <Reveal className="text-center max-w-2xl mx-auto mb-14">
                    <p className="eyebrow text-accent">Meet the Founder{stories.length > 1 ? 's' : ''}</p>
                    <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl text-primary">
                        The Story Behind Auraava
                    </h2>
                </Reveal>

                <div className="space-y-16">
                    {stories.map((founder, i) => (
                        <Reveal
                            key={founder.id}
                            className={`grid lg:grid-cols-[minmax(0,320px)_1fr] gap-8 lg:gap-14 items-center ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
                                }`}
                        >
                            <div className="mx-auto">
                                <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden shadow-card mx-auto">
                                    <Image
                                        src={founder.photo}
                                        alt={founder.name}
                                        fill
                                        sizes="(min-width: 768px) 288px, 224px"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="mt-5 text-center">
                                    <p className="font-serif text-xl text-primary">{founder.name}</p>
                                    <p className="text-sm text-accent">{founder.role}</p>
                                    {(founder.instagram || founder.linkedin) && (
                                        <div className="mt-3 flex items-center justify-center gap-3">
                                            {founder.instagram && (
                                                <a
                                                    href={founder.instagram}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={`${founder.name} on Instagram`}
                                                    className="w-9 h-9 rounded-full bg-white grid place-items-center text-primary hover:bg-primary hover:text-white transition shadow-card"
                                                >
                                                    <Instagram className="w-4 h-4" />
                                                </a>
                                            )}
                                            {founder.linkedin && (
                                                <a
                                                    href={founder.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={`${founder.name} on LinkedIn`}
                                                    className="w-9 h-9 rounded-full bg-white grid place-items-center text-primary hover:bg-primary hover:text-white transition shadow-card"
                                                >
                                                    <Linkedin className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Quote className="w-8 h-8 text-accent/60 mb-3" />
                                <p className="font-serif text-xl md:text-2xl text-primary leading-snug">
                                    &ldquo;{founder.quote}&rdquo;
                                </p>
                                <div className="mt-5 text-base md:text-lg leading-[1.85] max-w-2xl text-foreground/80 space-y-4">
                                    {founder.story.split(/\n+/).filter(Boolean).map((para, idx) => (
                                        <p key={idx}>{para}</p>
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
