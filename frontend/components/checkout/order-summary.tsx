"use client"

import Image from "next/image"
import type { CartItem } from "@/lib/cart-context"

interface OrderSummaryProps {
    items: CartItem[]
    subtotal: number
    shipping: number
    total: number
}

export default function OrderSummary({ items, subtotal, shipping, total }: OrderSummaryProps) {
    return (
        <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="font-serif text-xl text-primary">Order Summary</h2>
            <div className="my-5 h-px bg-border" />

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {items.map((item) => (
                    <div key={`${item.productId}-${item.selectedSize ?? "default"}`} className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-cream shrink-0">
                            {item.productImage && (
                                <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-primary truncate">{item.productName}</p>
                            {item.selectedSize && (
                                <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                                    Size: {item.selectedSize}
                                </p>
                            )}
                            <p className="text-[11px] text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-sm font-semibold text-accent-gold">
                                Rs. {(item.priceAtAddTime * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="my-5 h-px bg-border" />

            <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `Rs. ${shipping.toFixed(2)}`}</span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between font-semibold text-primary text-lg">
                <span>Total</span>
                <span className="text-accent-gold">Rs. {total.toFixed(2)}</span>
            </div>
        </div>
    )
}
