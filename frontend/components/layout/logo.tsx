import Link from "next/link"

export default function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
    const color = tone === "light" ? "text-white" : "text-primary"
    return (
        <Link href="/" className={`font-display font-bold text-2xl md:text-[28px] tracking-tight inline-flex items-center gap-2 shrink-0 ${color}`}>
            <span className="text-accent-gold text-xl leading-none">✦</span>
            <span className="leading-none">AURAAVA</span>
        </Link>
    )
}
