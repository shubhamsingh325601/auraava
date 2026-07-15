"use client"

import Link from "next/link"
import { ArrowLeft, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminPageHeaderProps {
    icon: LucideIcon
    eyebrow: string
    title: string
    subtitle?: string
    backHref?: string
    backLabel?: string
    actions?: React.ReactNode
}

export function AdminPageHeader({
    icon: Icon,
    eyebrow,
    title,
    subtitle,
    backHref = "/admin",
    backLabel = "Back to Dashboard",
    actions,
}: AdminPageHeaderProps) {
    return (
        <div className="bg-cream border-b border-border sticky top-0 z-10">
            <div className="container-x py-5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                        <span className="w-11 h-11 rounded-full bg-primary/10 grid place-items-center shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                        </span>
                        <div className="min-w-0">
                            <p className="eyebrow text-accent-gold">{eyebrow}</p>
                            <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary mt-0.5 truncate">{title}</h1>
                            {subtitle && <p className="text-muted-foreground text-sm mt-0.5">{subtitle}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        {actions}
                        <Link href={backHref}>
                            <Button className="rounded-full border border-border bg-white hover:bg-cream text-foreground flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] font-semibold">
                                <ArrowLeft className="w-4 h-4" />
                                {backLabel}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
