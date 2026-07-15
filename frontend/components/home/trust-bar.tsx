"use client"

import { Leaf, Rabbit, Sprout, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

const ITEMS = [
    { icon: Leaf, label: "100% Natural", sub: "Pure botanicals" },
    { icon: Rabbit, label: "Cruelty-Free", sub: "Never tested on animals" },
    { icon: Sprout, label: "Plant-Based", sub: "From earth to bottle" },
    { icon: Sparkles, label: "Ethically Sourced", sub: "Honest partnerships" },
]

export function TrustBar() {
    return (
        <section className="bg-cream border-y border-border">
            <div className="container-x grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4 py-10 md:py-14">
                {ITEMS.map((item, i) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3 justify-center md:justify-start"
                    >
                        <span className="w-10 h-10 rounded-full bg-primary/10 text-primary grid place-items-center shrink-0 transition-colors duration-300 hover:bg-primary/15">
                            <item.icon className="w-5 h-5" />
                        </span>
                        <div className="text-left">
                            <p className="text-sm font-semibold text-primary">{item.label}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{item.sub}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
