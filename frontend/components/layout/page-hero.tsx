import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface PageHeroCrumb {
    label: string
    href?: string
}

interface PageHeroProps {
    eyebrow: string
    title: string
    description?: string
    breadcrumb: PageHeroCrumb[]
}

export default function PageHero({ eyebrow, title, description, breadcrumb }: PageHeroProps) {
    return (
        <section className="relative grain bg-deep text-ivory overflow-hidden" style={{ minHeight: 260 }}>
            <div className="container-x relative py-16 md:py-20 flex flex-col items-center text-center">
                <p className="eyebrow text-accent-blush">{eyebrow}</p>
                <h1 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl font-bold text-ivory">
                    {title}
                </h1>
                {description && (
                    <p className="mt-4 max-w-xl text-sm md:text-base text-ivory/75">{description}</p>
                )}
                <nav
                    aria-label="Breadcrumb"
                    className="mt-6 flex flex-nowrap items-center justify-center gap-1.5 whitespace-nowrap text-[11px] uppercase tracking-[0.18em] text-ivory/65 max-w-full overflow-x-auto"
                >
                    <Link href="/" className="inline-flex min-h-0 min-w-0 items-center hover:text-accent-blush transition">Home</Link>
                    {breadcrumb.map((item, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 shrink-0">
                            <ChevronRight className="w-3 h-3 shrink-0" />
                            {item.href ? (
                                <Link href={item.href} className="inline-flex min-h-0 min-w-0 items-center hover:text-accent-blush transition">{item.label}</Link>
                            ) : (
                                <span className="text-ivory">{item.label}</span>
                            )}
                        </span>
                    ))}
                </nav>
            </div>
        </section>
    )
}
