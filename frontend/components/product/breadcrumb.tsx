import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbProps {
    items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <div className="bg-cream/60 border-b border-border">
            <nav aria-label="Breadcrumb" className="container-x py-4">
                <ol className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    <li>
                        <Link href="/" className="hover:text-primary transition-colors">
                            Home
                        </Link>
                    </li>
                    {items.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 min-w-0">
                            <ChevronRight className="w-3 h-3 shrink-0" />
                            {item.href ? (
                                <Link href={item.href} className="hover:text-primary transition-colors">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-primary truncate">{item.label}</span>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </div>
    )
}


