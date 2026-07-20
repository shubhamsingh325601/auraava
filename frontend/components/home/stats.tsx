"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"
import { ShopNowCta } from "@/components/home/shop-now-cta"

interface StatItem {
    id: string
    label: string
    number: string
    order: number
}

function parseStat(v: string) {
    const m = v.match(/^([\d.]+)(.*)$/)
    if (!m) return { num: 0, suffix: v }
    return { num: parseFloat(m[1]), suffix: m[2] }
}

function Counter({ value }: { value: string }) {
    const ref = useRef<HTMLSpanElement>(null)
    const inView = useInView(ref, { once: true, margin: "-80px" })
    const [n, setN] = useState(0)
    const { num, suffix } = parseStat(value)

    useEffect(() => {
        if (!inView) return
        const dur = 1600
        const start = performance.now()
        let raf = 0
        const step = (t: number) => {
            const p = Math.min(1, (t - start) / dur)
            setN(num * (1 - Math.pow(1 - p, 3)))
            if (p < 1) raf = requestAnimationFrame(step)
        }
        raf = requestAnimationFrame(step)
        return () => cancelAnimationFrame(raf)
    }, [inView, num])

    const display = num >= 10 ? Math.round(n).toString() : n.toFixed(1)
    return <span ref={ref}>{display}{suffix}</span>
}

export default function StatsSection() {
    const [stats, setStats] = useState<StatItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/stats')
            const data = await res.json()
            if (data.items) {
                setStats(data.items)
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return null
    }

    if (stats.length === 0) {
        return null
    }

    return (
        <section className="bg-cream py-16 md:py-20 overflow-x-hidden">
            <div className="container-x grid grid-cols-2 md:grid-cols-4 gap-y-10 divide-x divide-border">
                {stats.map((stat) => (
                    <div key={stat.id} className="text-center px-2">
                        <p className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-primary">
                            <Counter value={stat.number} />
                        </p>
                        <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>
            <ShopNowCta className="container-x mt-12" />
        </section>
    )
}

