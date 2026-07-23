"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, Search, X } from "lucide-react"
import { BRAND } from "@/lib/site-config"
import { useWaLink } from "@/lib/site-config-context"
import Logo from "./logo"

const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us" },
    { label: "Products", href: "/products" },
    { label: "Hair & Care", href: "/hair-care-tips" },
    { label: "Blog", href: "/blog" },
    { label: "FAQs", href: "/faqs" },
]

const TICKER = "✦ Free shipping on orders above ₹999    ✦ 100% Natural & Cruelty-Free    ✦ Plant-Based Hair Care    "

export default function MainNavigation() {
    const pathname = usePathname()
    const isHome = pathname === "/"
    const waLink = useWaLink()

    const [isOpen, setIsOpen] = useState(false)
    const [showNav, setShowNav] = useState(true)
    const [scrolled, setScrolled] = useState(false)
    const [pastHero, setPastHero] = useState(!isHome)
    const [lastScroll, setLastScroll] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY
            setScrolled(currentScroll > 24)

            if (isHome) {
                const heroThreshold = Math.max(window.innerHeight - 120, 480)
                setPastHero(currentScroll > heroThreshold)
            } else if (currentScroll > lastScroll && currentScroll > 200) {
                setShowNav(false)
            } else {
                setShowNav(true)
            }
            setLastScroll(currentScroll)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [lastScroll, isHome])

    const transparent = isHome && !pastHero

    return (
        <nav
            className={`fixed w-full z-50 top-0 transition-transform duration-500 ${
                showNav ? "translate-y-0" : "-translate-y-full"
            }`}
        >
            {/* Announcement ticker */}
            <div
                className={`bg-white text-deep text-[11px] tracking-[0.18em] uppercase overflow-hidden transition-all duration-500 ${
                    transparent ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
                }`}
            >
                <div className="relative flex whitespace-nowrap py-2 animate-marquee">
                    <span className="px-4">{TICKER.repeat(4)}</span>
                    <span className="px-4">{TICKER.repeat(4)}</span>
                </div>
            </div>

            {/* Main bar */}
            <div
                className={`transition-all duration-500 ${
                    transparent ? "bg-transparent" : "bg-deep"
                } ${scrolled && !transparent ? "shadow-[0_1px_0_rgba(0,0,0,0.2)]" : ""}`}
            >
                <div className="container-x flex items-center justify-between py-4 md:py-5">
                    <Logo tone="light" />

                    <ul className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="text-[12px] font-medium uppercase tracking-[0.14em] text-white/80 hover:text-accent-gold relative group py-2"
                                >
                                    {link.label}
                                    <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-px w-0 bg-accent-gold transition-all duration-300 group-hover:w-full" />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center gap-2 md:gap-3">
                        <button aria-label="Search" className="hidden md:grid place-items-center w-10 h-10 rounded-full hover:bg-white/10 transition">
                            <Search className="w-4 h-4 text-white" />
                        </button>
                        <a
                            href={waLink("Hi Auraava, I'd like to learn more about your products.")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:inline-flex items-center gap-2 px-4 h-11 rounded-full bg-whatsapp text-white text-[11px] font-semibold uppercase tracking-[0.16em] hover:brightness-110 transition"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            WhatsApp
                        </a>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden grid place-items-center min-w-[44px] min-h-[44px] rounded-full hover:bg-white/10 text-white"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile drawer */}
            <div
                className={`fixed inset-0 z-[60] transition-opacity duration-500 ${
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                aria-hidden={!isOpen}
            >
                <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
                <aside
                    className={`absolute right-0 top-0 h-full w-[86%] max-w-sm bg-deep text-ivory p-8 transition-transform duration-500 ${
                        isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <Logo tone="light" />
                        <button
                            aria-label="Close"
                            onClick={() => setIsOpen(false)}
                            className="w-10 h-10 grid place-items-center rounded-full hover:bg-white/10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <nav className="mt-12 flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="font-display text-3xl py-3 border-b border-white/10 hover:text-accent-blush transition"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <a
                        href={waLink("Hi Auraava!")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-10 inline-flex items-center justify-center w-full h-12 rounded-full bg-ivory text-primary text-[12px] font-semibold uppercase tracking-[0.16em]"
                    >
                        Enquire on WhatsApp
                    </a>
                    <p className="mt-8 text-xs opacity-70">{BRAND.hours}</p>
                </aside>
            </div>
        </nav>
    )
}
