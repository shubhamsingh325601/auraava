import Link from "next/link"
import { Facebook, Instagram, Youtube, Linkedin } from "lucide-react"
import { BRAND, waLink } from "@/lib/site-config"

function XIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
            <path d="M18.244 2H21l-6.55 7.49L22 22h-6.828l-4.79-6.262L4.8 22H2l7.02-8.024L2 2h6.914l4.31 5.7L18.244 2Zm-1.2 18h1.654L7.05 4H5.27l11.773 16Z" />
        </svg>
    )
}

const SHOP = [
    { label: "Hair Oils", href: "/products?category=oils" },
    { label: "Shampoos", href: "/products?category=shampoos" },
    { label: "Serums", href: "/products?category=serums" },
    { label: "Sprays", href: "/products?category=sprays" },
    { label: "All Products", href: "/products" },
]

const COMPANY = [
    { label: "About Us", href: "/about-us" },
    { label: "Journal", href: "/blog" },
    { label: "Hair & Care", href: "/hair-care-tips" },
    { label: "FAQs", href: "/faqs" },
]

const SOCIALS = [
    { href: BRAND.socials.instagram, icon: Instagram, label: "Instagram" },
    { href: BRAND.socials.facebook, icon: Facebook, label: "Facebook" },
    { href: BRAND.socials.youtube, icon: Youtube, label: "YouTube" },
    { href: BRAND.socials.x, icon: XIcon, label: "X" },
    { href: BRAND.socials.linkedin, icon: Linkedin, label: "LinkedIn" },
]

export default function Footer() {
    return (
        <footer className="bg-deep text-ivory relative">
            <div className="h-3 bg-gradient-to-b from-transparent to-deep" />
            <svg
                viewBox="0 0 1200 30"
                preserveAspectRatio="none"
                className="block w-full h-6 fill-accent-gold/40"
                aria-hidden="true"
            >
                <path d="M0 15 Q 300 0, 600 15 T 1200 15 V30 H0 Z" />
            </svg>

            <div className="container-x py-16 grid gap-12 md:grid-cols-12">
                <div className="md:col-span-4">
                    <div className="font-display font-bold text-3xl tracking-tight flex items-center gap-2">
                        <span className="text-accent-gold">✦</span> AURAAVA
                    </div>
                    <p className="mt-4 text-sm opacity-80 max-w-xs font-display italic text-lg">
                        Pure nature. Real results.
                    </p>
                    <div className="flex items-center gap-3 mt-8">
                        {SOCIALS.map(({ href, icon: Icon, label }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="w-10 h-10 grid place-items-center rounded-full border border-white/20 hover:bg-accent-gold hover:border-accent-gold hover:text-deep transition"
                            >
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>

                <FooterCol title="Shop" items={SHOP} />
                <FooterCol title="Company" items={COMPANY} />

                <div className="md:col-span-3">
                    <h4 className="eyebrow text-accent-blush">Contact</h4>
                    <ul className="mt-4 space-y-2 text-sm opacity-90">
                        <li>
                            <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`} className="hover:opacity-100">
                                {BRAND.phone}
                            </a>
                        </li>
                        {BRAND.emails.map((e) => (
                            <li key={e}>
                                <a href={`mailto:${e}`} className="hover:opacity-100">
                                    {e}
                                </a>
                            </li>
                        ))}
                        <li className="opacity-70">{BRAND.hours}</li>
                    </ul>
                    <a
                        href={waLink("Hi Auraava, I'd love to know more about your products.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center justify-center px-5 h-11 rounded-full bg-ivory text-primary text-[11px] font-semibold uppercase tracking-[0.18em] hover:bg-accent-gold hover:text-deep transition"
                    >
                        Chat on WhatsApp
                    </a>
                </div>
            </div>

            <div className="border-t border-white/10">
                <div className="container-x py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs opacity-70">
                    <p>© {new Date().getFullYear()} Auraava. Developed by BIOROIDTECH.</p>
                    <div className="flex gap-5">
                        <Link href={BRAND.policyPdf} className="hover:opacity-100">
                            Privacy
                        </Link>
                        <Link href={BRAND.policyPdf} className="hover:opacity-100">
                            Refunds
                        </Link>
                        <Link href={BRAND.policyPdf} className="hover:opacity-100">
                            Shipping
                        </Link>
                        <Link href={BRAND.policyPdf} className="hover:opacity-100">
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

function FooterCol({ title, items }: { title: string; items: { label: string; href: string }[] }) {
    return (
        <div className="md:col-span-2">
            <h4 className="eyebrow text-accent-blush">{title}</h4>
            <ul className="mt-4 space-y-2 text-sm opacity-90">
                {items.map((i) => (
                    <li key={i.label}>
                        <Link href={i.href} className="hover:opacity-100 hover:text-accent-gold transition">
                            {i.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
