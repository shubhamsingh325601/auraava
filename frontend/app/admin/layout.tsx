"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
    LayoutDashboard,
    Package,
    Newspaper,
    Tag,
    Star,
    HelpCircle,
    Sparkles,
    Instagram,
    Users,
    BarChart3,
    LogOut,
} from "lucide-react"

const NAV_ITEMS = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, match: "/admin" },
    { href: "/admin/products", label: "Products", icon: Package, match: "/admin/products" },
    { href: "/admin/blogs/new", label: "Blogs", icon: Newspaper, match: "/admin/blogs" },
    { href: "/admin/offers", label: "Offers", icon: Tag, match: "/admin/offers" },
    { href: "/admin/testimonials", label: "Testimonials", icon: Star, match: "/admin/testimonials" },
    { href: "/admin/faqs", label: "FAQs", icon: HelpCircle, match: "/admin/faqs" },
    { href: "/admin/hair-care", label: "Hair Care", icon: Sparkles, match: "/admin/hair-care" },
    { href: "/admin/instagram", label: "Instagram", icon: Instagram, match: "/admin/instagram" },
    { href: "/admin/about-us", label: "About Us", icon: Users, match: "/admin/about-us" },
    { href: "/admin/stats", label: "Statistics", icon: BarChart3, match: "/admin/stats" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()

    // Login page renders its own full-screen layout, no sidebar shell.
    if (pathname === "/admin/login") {
        return <>{children}</>
    }

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            })
            router.push("/admin/login")
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    const isActive = (match: string) =>
        match === "/admin" ? pathname === "/admin" : pathname?.startsWith(match)

    return (
        <div className="h-screen flex bg-ivory overflow-hidden">
            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-deep text-ivory h-full">
                <div className="px-6 py-7">
                    <span className="font-display text-2xl font-bold tracking-tight">
                        Auraava <span className="text-accent-gold">✦</span>
                    </span>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-ivory/60">Admin Panel</p>
                </div>
                <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const active = isActive(item.match)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 h-11 rounded-lg text-sm transition-colors ${active
                                    ? "bg-accent text-white font-semibold"
                                    : "text-ivory/75 hover:bg-white/10 hover:text-ivory"
                                    }`}
                            >
                                <item.icon className="w-4 h-4 shrink-0" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
                <div className="p-3 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 h-11 rounded-lg text-sm text-ivory/75 hover:bg-white/10 hover:text-ivory transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Log out
                    </button>
                </div>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0 h-full overflow-y-auto">{children}</div>
        </div>
    )
}
