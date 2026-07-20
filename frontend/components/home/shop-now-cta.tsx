import Link from "next/link"

export function ShopNowCta({
    variant = "light",
    className = "",
}: {
    variant?: "light" | "dark"
    className?: string
}) {
    return (
        <div className={`text-center ${className}`}>
            <Link
                href="/products"
                className={`inline-flex items-center gap-2 px-7 h-12 rounded-full text-[11px] font-semibold uppercase tracking-[0.16em] transition min-h-[44px] ${variant === "dark"
                        ? "bg-primary-foreground text-primary hover:bg-accent-gold hover:text-deep"
                        : "bg-primary text-primary-foreground hover:bg-accent-gold hover:text-deep"
                    }`}
            >
                Shop Now
            </Link>
        </div>
    )
}
