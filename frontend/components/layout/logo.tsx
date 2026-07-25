import Link from "next/link"
import Image from "next/image"

export default function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
    if (tone === "light") {
        return (
            <Link href="/" className="inline-flex items-center shrink-0">
                <div
                    className="w-20 sm:w-24 md:w-28 aspect-[2/1]"
                    role="img"
                    aria-label="Auraava"
                    style={{
                        background: 'linear-gradient(135deg, #C9A84C, #2E6B4F)',
                        WebkitMask: 'url(/bgimage/logo1.png) no-repeat center / contain',
                        mask: 'url(/bgimage/logo1.png) no-repeat center / contain',
                    }}
                />
            </Link>
        )
    }

    return (
        <Link href="/" className="inline-flex items-center shrink-0">
            <Image
                src="/bgimage/logo1.png"
                alt="Auraava"
                width={120}
                height={60}
                priority
                className="object-contain w-20 sm:w-24 md:w-28 h-auto"
            />
        </Link>
    )
}
