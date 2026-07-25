import Link from "next/link"
import Image from "next/image"

export default function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
    return (
        <Link href="/" className="inline-flex items-center shrink-0">
            <Image
                src="/bgimage/logo1.png"
                alt="Auraava"
                width={160}
                height={80}
                priority
                className={`object-contain w-28 sm:w-32 md:w-36 h-auto ${tone === "light" ? "brightness-0 invert" : ""}`}
            />
        </Link>
    )
}
