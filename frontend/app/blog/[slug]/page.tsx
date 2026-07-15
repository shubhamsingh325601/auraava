"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Newsletter from "@/components/layout/newsletter"

interface Blog {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    author: string
    category: string
    image: string
    publishedAt: string
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const [blog, setBlog] = useState<Blog | null>(null)
    const [loading, setLoading] = useState(true)
    const [slug, setSlug] = useState<string>('')
    const [moreBlogs, setMoreBlogs] = useState<Blog[]>([])

    useEffect(() => {
        const initializeAndFetch = async () => {
            const resolvedParams = await params
            setSlug(resolvedParams.slug)
        }
        initializeAndFetch()
    }, [])

    useEffect(() => {
        if (slug) {
            fetchBlog()
        }
    }, [slug])

    const fetchBlog = async () => {
        try {
            const res = await fetch(`/api/blogs/slug/${slug}`)
            if (!res.ok) {
                notFound()
                return
            }
            const data = await res.json()
            setBlog(data.blog)
        } catch (error) {
            console.error('Failed to fetch blog:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!blog) return

        const fetchMoreBlogs = async () => {
            try {
                const res = await fetch("/api/blogs")
                const data = await res.json()
                const all: Blog[] = data.blogs || []
                setMoreBlogs(all.filter((b) => b.slug !== blog.slug).slice(0, 3))
            } catch (error) {
                console.error("Failed to fetch related blogs:", error)
            }
        }

        fetchMoreBlogs()
    }, [blog])

    if (loading) {
        return (
            <div className="min-h-screen bg-blush">
                <Header />
                <div className="container-x pt-40 md:pt-52 pb-16 text-center">
                    <div className="text-muted-foreground">Loading blog post...</div>
                </div>
                <Footer />
            </div>
        )
    }

    if (!blog) {
        notFound()
        return null
    }

    return (
        <div className="min-h-screen bg-blush">
            <Header />

            <article className="bg-blush">
                <div className="max-w-3xl mx-auto px-5 md:px-8 pt-40 md:pt-52 pb-16">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-semibold text-primary hover:text-accent transition"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Journal
                    </Link>

                    <div className="mt-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        <span className="px-3 py-1 rounded-full bg-sage text-primary font-semibold">
                            {blog.category}
                        </span>
                        <span>
                            {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </span>
                    </div>

                    <h1 className="mt-5 font-display font-bold text-3xl sm:text-4xl md:text-5xl leading-tight text-primary">
                        {blog.title}
                    </h1>

                    <div className="mt-6 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-primary text-primary-foreground grid place-items-center font-display text-lg">
                            {blog.author.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-primary">{blog.author}</p>
                            <p className="text-xs text-muted-foreground">Auraava Contributor</p>
                        </div>
                    </div>

                    <div className="mt-10 relative aspect-[16/10] overflow-hidden rounded-2xl bg-cream">
                        <Image
                            src={blog.image}
                            alt={blog.title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg mt-10 max-w-none">
                        {blog.content.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="text-[17px] sm:text-[18px] leading-[1.8] text-foreground mb-6">
                                {paragraph.split('\n').map((line, i) => {
                                    // Handle bold text
                                    if (line.startsWith('**') && line.endsWith('**')) {
                                        return (
                                            <strong key={i} className="font-bold text-primary">
                                                {line.slice(2, -2)}
                                            </strong>
                                        )
                                    }
                                    return <span key={i}>{line}<br /></span>
                                })}
                            </p>
                        ))}
                    </div>

                    <div className="mt-14 pt-8 border-t border-border">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-semibold text-primary hover:text-accent transition"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Journal
                        </Link>
                    </div>
                </div>
            </article>

            {moreBlogs.length > 0 && (
                <section className="bg-ivory section-pad">
                    <div className="container-x">
                        <h2 className="font-display text-3xl md:text-4xl text-primary text-center">
                            More Articles
                        </h2>
                        <div className="mt-10 grid md:grid-cols-3 gap-6 md:gap-8">
                            {moreBlogs.map((m) => (
                                <Link
                                    key={m.slug}
                                    href={`/blog/${m.slug}`}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-500 flex flex-col"
                                >
                                    <div className="relative aspect-[16/9] overflow-hidden bg-cream">
                                        <Image
                                            src={m.image}
                                            alt={m.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <span className="inline-block px-3 py-1 rounded-full bg-cream text-[10px] uppercase tracking-[0.18em] font-semibold text-primary">
                                            {m.category}
                                        </span>
                                        <h3 className="mt-3 font-serif text-xl text-primary line-clamp-2">{m.title}</h3>
                                        <span className="mt-4 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] font-semibold text-accent">
                                            Read <ArrowRight className="w-3.5 h-3.5" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <Newsletter />
            <Footer />
        </div>
    )
}
