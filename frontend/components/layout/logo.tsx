import Link from "next/link"
import Image from "next/image"

export default function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
    return (
        <Link href="/" className="inline-flex items-center shrink-0">
            <div className="relative">
                {tone === "light" && (
                    <div className="absolute -inset-3 rounded-xl bg-gradient-to-br from-white/25 to-white/5" />
                )}
                <Image
                    src="/bgimage/logo1.png"
                    alt="Auraava"
                    width={120}
                    height={60}
                    priority
                    className="object-contain w-20 sm:w-24 md:w-28 h-auto relative"
                />
            </div>
        </Link>
    )
}
