"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/auth/protected-route"
import {
    Package,
    Star,
    HelpCircle,
    Tag,
    Edit,
    LogOut,
    Sparkles,
    Instagram,
    Users,
    Heart,
    BarChart3,
    ClipboardList,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface SectionCount {
    products: number | null
    offers: number | null
    testimonials: number | null
    faqs: number | null
    hairCare: number | null
    instagram: number | null
    aboutUs: number | null
    founderStories: number | null
    orders: number | null
}

const SUMMARY_CARDS = [
    { key: "orders" as const, label: "Orders", icon: ClipboardList, href: "/admin/orders", cta: "Manage Orders" },
    { key: "products" as const, label: "Products", icon: Package, href: "/admin/products", cta: "Manage Products" },
    { key: "offers" as const, label: "Special Offers", icon: Tag, href: "/admin/offers", cta: "Manage Offers" },
    { key: "testimonials" as const, label: "Testimonials", icon: Star, href: "/admin/testimonials", cta: "Manage Testimonials" },
    { key: "faqs" as const, label: "FAQs", icon: HelpCircle, href: "/admin/faqs", cta: "Manage FAQs" },
    { key: "hairCare" as const, label: "Hair Care Tips", icon: Sparkles, href: "/admin/hair-care", cta: "Manage Hair Care" },
    { key: "instagram" as const, label: "Instagram Posts", icon: Instagram, href: "/admin/instagram", cta: "Manage Instagram" },
    { key: "aboutUs" as const, label: "About Us", icon: Users, href: "/admin/about-us", cta: "Manage About Us" },
    { key: "founderStories" as const, label: "Founder Stories", icon: Heart, href: "/admin/founder-stories", cta: "Manage Founder Stories" },
]

export default function AdminDashboard() {
    const router = useRouter()
    const [counts, setCounts] = useState<SectionCount>({
        products: null,
        offers: null,
        testimonials: null,
        faqs: null,
        hairCare: null,
        instagram: null,
        aboutUs: null,
        founderStories: null,
        orders: null,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAllCounts()
    }, [])

    const fetchAllCounts = async () => {
        try {
            const [productsRes, offersRes, testimonialsRes, faqsRes, hairCareRes, instagramRes, aboutUsRes, founderStoriesRes, ordersRes] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/offers'),
                fetch('/api/testimonials'),
                fetch('/api/faqs'),
                fetch('/api/hair-care'),
                fetch('/api/instagram'),
                fetch('/api/about-us'),
                fetch('/api/founder-stories'),
                fetch('/api/admin/orders', { credentials: 'include' }),
            ])

            const [productsData, offersData, testimonialsData, faqsData, hairCareData, instagramData, aboutUsData, founderStoriesData, ordersData] = await Promise.all([
                productsRes.json(),
                offersRes.json(),
                testimonialsRes.json(),
                faqsRes.json(),
                hairCareRes.json(),
                instagramRes.json(),
                aboutUsRes.json(),
                founderStoriesRes.json(),
                ordersRes.ok ? ordersRes.json() : Promise.resolve({ orders: [] }),
            ])

            setCounts({
                products: (productsData.products || []).length,
                offers: (offersData.offers || []).length,
                testimonials: (testimonialsData.testimonials || []).length,
                faqs: (faqsData.faqs || []).length,
                hairCare: (hairCareData.items || []).length,
                instagram: (instagramData.posts || []).length,
                aboutUs: (aboutUsData.sections || []).length,
                founderStories: (founderStoriesData.stories || []).length,
                orders: (ordersData.orders || []).length,
            })
        } catch (error) {
            console.error('Failed to fetch data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            })
            router.push('/admin/login')
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-ivory">
                {/* Header */}
                <div className="bg-cream border-b border-border sticky top-0 z-10">
                    <div className="container-x py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="eyebrow text-accent-gold">Overview</p>
                                <h1 className="text-3xl font-display font-bold text-primary mt-1">Admin Dashboard</h1>
                                <p className="text-muted-foreground text-sm mt-1">Manage your content</p>
                            </div>
                            <Button
                                onClick={handleLogout}
                                className="rounded-full border border-border bg-white hover:bg-cream text-foreground flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] font-semibold"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>

                <main className="container-x py-10">
                    {loading ? (
                        <div className="flex items-center justify-center gap-3 text-muted-foreground">
                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                            <span>Loading...</span>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {SUMMARY_CARDS.map((card) => (
                                <div key={card.key} className="bg-cream rounded-2xl shadow-card p-6 flex flex-col justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="w-11 h-11 rounded-full bg-primary/10 grid place-items-center shrink-0">
                                            <card.icon className="w-5 h-5 text-primary" />
                                        </span>
                                        <div>
                                            <h2 className="text-lg font-display font-bold text-primary">{card.label}</h2>
                                            <p className="text-sm text-muted-foreground">
                                                {counts[card.key] === null ? '—' : `${counts[card.key]} item${counts[card.key] === 1 ? '' : 's'}`}
                                            </p>
                                        </div>
                                    </div>
                                    <Link href={card.href} className="mt-5">
                                        <Button className="w-full rounded-full bg-primary hover:bg-primary-light text-primary-foreground flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.16em] font-semibold">
                                            <Edit className="w-4 h-4" />
                                            {card.cta}
                                        </Button>
                                    </Link>
                                </div>
                            ))}

                            {/* Statistics */}
                            <div className="bg-cream rounded-2xl shadow-card p-6 flex flex-col justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="w-11 h-11 rounded-full bg-primary/10 grid place-items-center shrink-0">
                                        <BarChart3 className="w-5 h-5 text-primary" />
                                    </span>
                                    <div>
                                        <h2 className="text-lg font-display font-bold text-primary">Statistics</h2>
                                        <p className="text-sm text-muted-foreground">Home page counters</p>
                                    </div>
                                </div>
                                <Link href="/admin/stats" className="mt-5">
                                    <Button className="w-full rounded-full bg-primary hover:bg-primary-light text-primary-foreground flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.16em] font-semibold">
                                        <Edit className="w-4 h-4" />
                                        Manage Statistics
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    )
}
