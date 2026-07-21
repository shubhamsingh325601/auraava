import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/reveal"

const categories = [
    {
        id: "oils",
        name: "Hair Oils",
        tagline: "Nourish & Strengthen",
        image: "/images/cat-oils.png",
    },
    {
        id: "shampoos",
        name: "Shampoos",
        tagline: "Cleanse & Revitalize",
        image: "/images/cat-shampoo.png",
    },
    {
        id: "serums",
        name: "Hair Serums",
        tagline: "Frizz-Free & Glossy",
        image: "/images/cat-serum.png",
    },
    {
        id: "sprays",
        name: "Hair Sprays",
        tagline: "Protect & Style",
        image: "/images/cat-spray.png",
    },
]

export default function Categories() {
    return (
        <section id="categories" className="section-pad bg-ivory overflow-x-hidden">
            <div className="container-x">
                <Reveal className="text-center max-w-2xl mx-auto">
                    <p className="eyebrow text-accent">Our Collections</p>
                    <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl text-primary">
                        Explore Our Collections
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        Crafted with nature&apos;s finest ingredients for every hair need.
                    </p>
                </Reveal>

                <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {categories.map((category, i) => (
                        <Reveal key={category.id} delay={i * 0.06}>
                            <Link
                                href={`/products?category=${category.id}`}
                                className="group relative block rounded-2xl overflow-hidden aspect-[3/4] bg-cream shadow-card hover:shadow-hover transition-shadow min-h-[44px]"
                            >
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    loading="lazy"
                                    className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                                <div className="absolute inset-0 p-5 md:p-7 flex flex-col justify-end text-white">
                                    <p className="eyebrow text-white/80 text-[10px]">{category.tagline}</p>
                                    <h3 className="font-serif text-xl md:text-2xl mt-1.5">{category.name}</h3>
                                    <span className="mt-3 inline-flex items-center gap-1 text-[11px] tracking-[0.14em] uppercase opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                                        Shop now <ArrowUpRight className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    )
}
