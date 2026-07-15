"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Loader2 } from "lucide-react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Newsletter from "@/components/layout/newsletter"
import PageHero from "@/components/layout/page-hero"

interface Blog {
    id: string
    title: string
    slug: string
    excerpt: string
    author: string
    category: string
    image: string
    publishedAt: string
}

export default function BlogPage() {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchBlogs()
    }, [])

    const fetchBlogs = async () => {
        try {
            const res = await fetch("/api/blogs")
            const data = await res.json()
            setBlogs(data.blogs || [])
        } catch (error) {
            console.error("Failed to fetch blogs:", error)
        } finally {
            setLoading(false)
        }
    }

    const [featured, ...rest] = blogs

    return (
        <div className="min-h-screen bg-blush">
            <Header />

            <main>
                <PageHero
                    eyebrow="Our Journal"
                    title="The Auraava Journal"
                    description="Expert hair care advice, tips, and ingredient stories from our founders and formulators."
                    breadcrumb={[{ label: "Blog" }]}
                />

                <section className="bg-blush">
                    {loading ? (
                        <div className="container-x pb-24 pt-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            <span>Loading blogs...</span>
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="container-x pb-24 text-center py-20 text-muted-foreground">
                            No blogs found
                        </div>
                    ) : (
                        <>
                            {/* Featured */}
                            {featured && (
                                <div className="container-x pt-8 pb-16">
                                    <Link
                                        href={`/blog/${featured.slug}`}
                                        className="group grid md:grid-cols-2 gap-8 md:gap-12 items-center bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-500"
                                    >
                                        <div className="relative aspect-[4/3] md:aspect-auto md:h-full overflow-hidden bg-cream">
                                            <Image
                                                src={featured.image}
                                                alt={featured.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-8 md:p-12">
                                            <span className="inline-block px-3 py-1 rounded-full bg-sage text-[10px] uppercase tracking-[0.18em] font-semibold text-primary">
                                                {featured.category}
                                            </span>
                                            <h2 className="mt-4 font-display text-3xl md:text-4xl leading-tight text-primary">
                                                {featured.title}
                                            </h2>
                                            <p className="mt-4 text-muted-foreground">{featured.excerpt}</p>
                                            <div className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                                <span>{featured.author}</span>
                                                <span className="w-1 h-1 rounded-full bg-current" />
                                                <span>
                                                    {new Date(featured.publishedAt).toLocaleDateString("en-US", {
                                                        month: "long",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                            <span className="mt-8 inline-flex items-center gap-2 px-6 h-11 rounded-full bg-primary text-primary-foreground text-[11px] uppercase tracking-[0.18em] font-semibold group-hover:bg-primary-light transition">
                                                Read Article <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            )}

                            {/* Grid */}
                            <div className="container-x pb-24">
                                <motion.div
                                    layout
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                                    initial="hidden"
                                    animate="show"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        show: {
                                            opacity: 1,
                                            transition: { staggerChildren: 0.15 },
                                        },
                                    }}
                                >
                                    {rest.map((blog) => (
                                        <motion.div
                                            key={blog.id}
                                            variants={{
                                                hidden: { opacity: 0, y: 30 },
                                                show: { opacity: 1, y: 0 },
                                            }}
                                        >
                                            <BlogCard blog={blog} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </>
                    )}
                </section>
            </main>

            <Newsletter />
            <Footer />
        </div>
    )
}

function BlogCard({ blog }: { blog: Blog }) {
    return (
        <Link href={`/blog/${blog.slug}`} className="group block h-full">
            <motion.article
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-500 flex flex-col h-full"
            >
                <div className="relative aspect-[16/9] overflow-hidden bg-cream">
                    <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </div>
                <div className="p-6 flex flex-col flex-1">
                    <span className="inline-block self-start px-3 py-1 rounded-full bg-cream text-[10px] uppercase tracking-[0.18em] font-semibold text-primary">
                        {blog.category}
                    </span>
                    <h3 className="mt-4 font-serif text-[22px] leading-snug text-primary line-clamp-2 group-hover:text-accent transition">
                        {blog.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{blog.excerpt}</p>
                    <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                            <div>{blog.author}</div>
                            <div className="mt-0.5 opacity-80">
                                {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </div>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] font-semibold text-accent group-hover:gap-2 transition-all">
                            Read <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                    </div>
                </div>
            </motion.article>
        </Link>
    )
}
