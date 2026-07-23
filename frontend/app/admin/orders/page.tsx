"use client"

import { adminFetch } from "@/lib/admin-fetch"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import ProtectedRoute from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { AdminPageHeader } from "@/components/admin/page-header"
import { ClipboardList, Search, Eye, Loader2 } from "lucide-react"

interface OrderListItem {
    id: string
    orderNumber: string
    customer: { name: string; phone: string; email?: string }
    total: number
    paymentStatus: string
    status: string
    createdAt: string
}

const STATUS_OPTIONS = ["New", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"] as const

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<OrderListItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState<string>("")
    const [search, setSearch] = useState("")

    const fetchOrders = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const params = new URLSearchParams()
            if (statusFilter) params.set("status", statusFilter)
            if (search.trim()) params.set("search", search.trim())

            const res = await adminFetch(`/api/admin/orders?${params.toString()}`, { credentials: "include" })
            const data = await res.json().catch(() => null)
            if (!res.ok) {
                setError(data?.error ?? "Failed to load orders")
                return
            }
            setOrders(data.orders || [])
        } catch {
            setError("Could not reach the server. Please try again.")
        } finally {
            setLoading(false)
        }
    }, [statusFilter, search])

    useEffect(() => {
        const timeout = setTimeout(fetchOrders, 250) // debounce search typing
        return () => clearTimeout(timeout)
    }, [fetchOrders])

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-ivory">
                <AdminPageHeader
                    icon={ClipboardList}
                    eyebrow="Order Management"
                    title="Orders"
                    subtitle="Direct Checkout orders"
                />

                <main className="container-x py-10">
                    <div className="bg-cream rounded-2xl shadow-card p-6">
                        <div className="flex flex-col sm:flex-row gap-3 mb-6">
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by order number, name, phone or email"
                                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2.5 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                            >
                                <option value="">All Statuses</option>
                                {STATUS_OPTIONS.map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center gap-3 text-muted-foreground py-12">
                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                <span>Loading orders...</span>
                            </div>
                        ) : error ? (
                            <div className="text-center text-destructive py-12">{error}</div>
                        ) : orders.length === 0 ? (
                            <div className="flex flex-col items-center text-center py-12">
                                <div className="w-16 h-16 grid place-items-center rounded-full bg-sage text-primary">
                                    <ClipboardList className="w-7 h-7" />
                                </div>
                                <h3 className="mt-5 font-serif text-lg text-primary">No orders found</h3>
                                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                                    Orders will show up here once customers start checking out.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-xl border border-border bg-white">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border bg-cream/60">
                                            <th className="py-3 px-4 font-semibold">Order #</th>
                                            <th className="py-3 px-4 font-semibold">Customer</th>
                                            <th className="py-3 px-4 font-semibold">Phone</th>
                                            <th className="py-3 px-4 font-semibold">Total</th>
                                            <th className="py-3 px-4 font-semibold">Payment</th>
                                            <th className="py-3 px-4 font-semibold">Status</th>
                                            <th className="py-3 px-4 font-semibold">Date</th>
                                            <th className="py-3 px-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id} className="border-b border-border last:border-0 hover:bg-cream/40 transition-colors">
                                                <td className="py-3 px-4 font-semibold text-primary">{order.orderNumber}</td>
                                                <td className="py-3 px-4 text-foreground">{order.customer.name}</td>
                                                <td className="py-3 px-4 text-foreground">{order.customer.phone}</td>
                                                <td className="py-3 px-4 text-foreground">Rs. {order.total.toFixed(2)}</td>
                                                <td className="py-3 px-4">
                                                    <StatusPill label={order.paymentStatus} />
                                                </td>
                                                <td className="py-3 px-4">
                                                    <StatusPill label={order.status} />
                                                </td>
                                                <td className="py-3 px-4 text-muted-foreground">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Link href={`/admin/orders/${order.id}`}>
                                                        <Button size="sm" className="rounded-full border border-border bg-white hover:bg-cream text-foreground">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    )
}

const POSITIVE_STATUSES = new Set(["delivered", "paid", "confirmed", "completed", "success"])
const NEGATIVE_STATUSES = new Set(["cancelled", "canceled", "failed", "refunded"])

function StatusPill({ label }: { label: string }) {
    const key = label.toLowerCase()
    const tone = NEGATIVE_STATUSES.has(key)
        ? "bg-destructive/10 text-destructive"
        : POSITIVE_STATUSES.has(key)
            ? "bg-primary-soft text-primary"
            : "bg-accent-gold/15 text-accent-gold"

    return (
        <span className={`inline-flex items-center px-3 h-6 rounded-full text-[11px] uppercase tracking-[0.08em] font-semibold whitespace-nowrap ${tone}`}>
            {label}
        </span>
    )
}
