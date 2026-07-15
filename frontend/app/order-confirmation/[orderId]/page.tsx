"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import PageHero from "@/components/layout/page-hero"

interface OrderItem {
    productId: string
    name: string
    price: number
    quantity: number
    subtotal: number
    selectedSize?: string
}

interface Order {
    id: string
    orderNumber: string
    customer: { name: string; phone: string; email?: string }
    shippingAddress: { addressLine: string; city: string; state: string; pincode: string }
    items: OrderItem[]
    subtotal: number
    shipping: number
    total: number
    paymentStatus: string
    status: string
}

export default function OrderConfirmationPage({ params }: { params: { orderId: string } }) {
    const [order, setOrder] = useState<Order | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        async function fetchOrder() {
            try {
                const response = await fetch(`/api/orders/${params.orderId}`)
                const data = await response.json().catch(() => null)
                if (cancelled) return

                if (!response.ok || !data?.order) {
                    setError(data?.error ?? "We couldn't find this order.")
                    return
                }
                setOrder(data.order)
            } catch {
                if (!cancelled) setError("We couldn't reach the server. Please try again.")
            } finally {
                if (!cancelled) setIsLoading(false)
            }
        }

        fetchOrder()
        return () => {
            cancelled = true
        }
    }, [params.orderId])

    return (
        <div className="min-h-screen bg-ivory">
            <Header />

            <main>
                <PageHero
                    eyebrow="Order Confirmation"
                    title="Thank You"
                    breadcrumb={[{ label: "Order Confirmation" }]}
                />

                <section className="section-pad bg-ivory">
                    <div className="container-x max-w-3xl">
                        {isLoading ? (
                            <div className="text-center py-20 text-muted-foreground">Loading your order...</div>
                        ) : error || !order ? (
                            <OrderNotFound message={error ?? "We couldn't find this order."} />
                        ) : (
                            <OrderConfirmation order={order} />
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

function OrderNotFound({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center text-center py-16">
            <h2 className="font-serif text-2xl text-primary">Order Not Found</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">{message}</p>
            <Link
                href="/products"
                className="mt-8 inline-flex items-center justify-center px-7 h-12 rounded-full bg-primary hover:bg-primary-light text-primary-foreground font-semibold uppercase tracking-[0.16em] text-[12px] transition shadow-card"
            >
                Continue Shopping
            </Link>
        </div>
    )
}

function OrderConfirmation({ order }: { order: Order }) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 grid place-items-center rounded-full bg-sage text-primary">
                    <CheckCircle2 className="w-9 h-9" />
                </div>
                <h2 className="mt-5 font-serif text-2xl text-primary">Your order has been received successfully.</h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                    Payment will be completed in the next step.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-card p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Order Number</p>
                        <p className="mt-1 font-serif text-xl text-primary">{order.orderNumber}</p>
                    </div>
                    <div className="flex gap-2">
                        <StatusPill label={order.status} />
                        <StatusPill label={order.paymentStatus} />
                    </div>
                </div>

                <div className="my-5 h-px bg-border" />

                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Customer</p>
                <p className="mt-1 text-sm text-primary">{order.customer.name}</p>

                <div className="my-5 h-px bg-border" />

                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-3">Ordered Products</p>
                <div className="space-y-3">
                    {order.items.map((item, idx) => (
                        <div key={`${item.productId}-${idx}`} className="flex items-start justify-between gap-3 text-sm">
                            <div>
                                <p className="text-primary font-medium">{item.name}</p>
                                <p className="text-muted-foreground text-xs">
                                    {item.selectedSize && <>Size: {item.selectedSize} · </>}
                                    Qty: {item.quantity}
                                </p>
                            </div>
                            <p className="text-accent-gold font-semibold shrink-0">Rs. {item.subtotal.toFixed(2)}</p>
                        </div>
                    ))}
                </div>

                <div className="my-5 h-px bg-border" />

                <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>Rs. {order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span>Shipping</span>
                        <span>{order.shipping === 0 ? "Free" : `Rs. ${order.shipping.toFixed(2)}`}</span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between font-semibold text-primary text-lg">
                    <span>Total</span>
                    <span className="text-accent-gold">Rs. {order.total.toFixed(2)}</span>
                </div>
            </div>

            <div className="flex justify-center">
                <Link
                    href="/products"
                    className="inline-flex items-center justify-center px-7 h-12 rounded-full bg-primary hover:bg-primary-light text-primary-foreground font-semibold uppercase tracking-[0.16em] text-[12px] transition shadow-card"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    )
}

function StatusPill({ label }: { label: string }) {
    return (
        <span className="inline-flex items-center px-3 h-7 rounded-full bg-accent-blush/40 text-primary text-[11px] uppercase tracking-[0.12em] font-medium">
            {label}
        </span>
    )
}
