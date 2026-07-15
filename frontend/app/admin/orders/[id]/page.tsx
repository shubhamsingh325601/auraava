"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import ProtectedRoute from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { AdminPageHeader } from "@/components/admin/page-header"
import { ClipboardList, Loader2 } from "lucide-react"

interface OrderItem {
    productId: string
    name: string
    price: number
    quantity: number
    subtotal: number
    selectedSize?: string
}

interface OrderDetail {
    id: string
    orderNumber: string
    customer: { name: string; phone: string; email?: string }
    shippingAddress: { addressLine: string; city: string; state: string; pincode: string }
    items: OrderItem[]
    subtotal: number
    shipping: number
    total: number
    paymentMethod?: string
    paymentStatus: string
    status: string
    createdAt: string
    updatedAt: string
}

const STATUS_OPTIONS = ["New", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"] as const

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
    const [order, setOrder] = useState<OrderDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [updating, setUpdating] = useState(false)
    const [updateError, setUpdateError] = useState<string | null>(null)

    const fetchOrder = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`/api/admin/orders/${params.id}`, { credentials: "include" })
            const data = await res.json().catch(() => null)
            if (!res.ok || !data?.order) {
                setError(data?.error ?? "Order not found")
                return
            }
            setOrder(data.order)
        } catch {
            setError("Could not reach the server. Please try again.")
        } finally {
            setLoading(false)
        }
    }, [params.id])

    useEffect(() => {
        fetchOrder()
    }, [fetchOrder])

    const handleStatusChange = async (status: string) => {
        if (!order) return
        setUpdating(true)
        setUpdateError(null)
        try {
            const res = await fetch(`/api/admin/orders/${order.id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ status }),
            })
            const data = await res.json().catch(() => null)
            if (!res.ok || !data?.order) {
                setUpdateError(data?.error ?? "Failed to update status")
                return
            }
            setOrder(data.order)
        } catch {
            setUpdateError("Could not reach the server. Please try again.")
        } finally {
            setUpdating(false)
        }
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-ivory">
                <AdminPageHeader
                    icon={ClipboardList}
                    eyebrow="Order Management"
                    title="Order Detail"
                    backHref="/admin/orders"
                    backLabel="Back to Orders"
                />

                <main className="container-x py-10 max-w-3xl">
                    {loading ? (
                        <div className="flex items-center justify-center gap-3 text-muted-foreground py-12">
                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                            <span>Loading order...</span>
                        </div>
                    ) : error || !order ? (
                        <div className="text-center text-destructive py-12">{error ?? "Order not found"}</div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-cream rounded-2xl shadow-card p-6">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider font-semibold text-primary mb-2">Order Number</p>
                                        <p className="font-display text-xl font-bold text-primary">{order.orderNumber}</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Placed {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="bg-cream rounded-2xl shadow-card p-6">
                                    <h2 className="font-display font-bold text-lg text-primary mb-3">Customer</h2>
                                    <div className="bg-white border border-border rounded-xl p-4 space-y-1">
                                        <p className="text-sm"><span className="text-muted-foreground">Name:</span> {order.customer.name}</p>
                                        <p className="text-sm"><span className="text-muted-foreground">Phone:</span> {order.customer.phone}</p>
                                        {order.customer.email && (
                                            <p className="text-sm"><span className="text-muted-foreground">Email:</span> {order.customer.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-cream rounded-2xl shadow-card p-6">
                                    <h2 className="font-display font-bold text-lg text-primary mb-3">Shipping Address</h2>
                                    <div className="bg-white border border-border rounded-xl p-4 space-y-1">
                                        <p className="text-sm">{order.shippingAddress.addressLine}</p>
                                        <p className="text-sm">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-cream rounded-2xl shadow-card p-6">
                                <h2 className="font-display font-bold text-lg text-primary mb-4">Ordered Products</h2>
                                <div className="space-y-3">
                                    {order.items.map((item, idx) => (
                                        <div key={`${item.productId}-${idx}`} className="flex items-start justify-between gap-3 text-sm bg-white border border-border rounded-xl p-4">
                                            <div>
                                                <p className="font-semibold text-foreground">{item.name}</p>
                                                <p className="text-muted-foreground text-xs mt-0.5">
                                                    {item.selectedSize && <>Size: {item.selectedSize} · </>}
                                                    Qty: {item.quantity} × Rs. {item.price.toFixed(2)}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-primary shrink-0">Rs. {item.subtotal.toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 pt-4 border-t border-border space-y-1 text-sm">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Subtotal</span>
                                        <span>Rs. {order.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Shipping</span>
                                        <span>{order.shipping === 0 ? "Free" : `Rs. ${order.shipping.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-primary text-base pt-1">
                                        <span>Total</span>
                                        <span>Rs. {order.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-cream rounded-2xl shadow-card p-6">
                                <h2 className="font-display font-bold text-lg text-primary mb-4">Status</h2>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider font-semibold text-primary mb-2">Payment Status</p>
                                        <p className="text-sm text-primary capitalize">{order.paymentStatus}</p>
                                        {order.paymentMethod && (
                                            <p className="text-xs text-muted-foreground mt-1">via {order.paymentMethod}</p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wider font-semibold text-primary mb-2">Fulfillment Status</p>
                                        <select
                                            value={order.status}
                                            disabled={updating}
                                            onChange={(e) => handleStatusChange(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all disabled:opacity-60"
                                        >
                                            {STATUS_OPTIONS.map((status) => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                        {updateError && (
                                            <p className="mt-2 text-xs text-destructive">{updateError}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    )
}
