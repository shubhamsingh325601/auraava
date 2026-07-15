"use client"

import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import PageHero from "@/components/layout/page-hero"
import { useCart } from "@/lib/cart-context"

export default function CartPage() {
    const { items, isHydrated, increaseQuantity, decreaseQuantity, removeItem, subtotal, itemCount } = useCart()

    return (
        <div className="min-h-screen bg-ivory">
            <Header />

            <main>
                <PageHero
                    eyebrow="Your Selection"
                    title="Your Cart"
                    breadcrumb={[{ label: "Cart" }]}
                />

                <section className="section-pad bg-ivory">
                    <div className="container-x max-w-4xl">
                        {!isHydrated ? (
                            <div className="text-center py-20 text-muted-foreground">Loading your cart...</div>
                        ) : items.length === 0 ? (
                            <EmptyCart />
                        ) : (
                            <div className="grid lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-4">
                                    {items.map((item) => (
                                        <CartLine
                                            key={`${item.productId}-${item.selectedSize ?? "default"}`}
                                            item={item}
                                            onIncrease={() => increaseQuantity(item.productId, item.selectedSize)}
                                            onDecrease={() => decreaseQuantity(item.productId, item.selectedSize)}
                                            onRemove={() => removeItem(item.productId, item.selectedSize)}
                                        />
                                    ))}
                                </div>

                                <div className="lg:col-span-1">
                                    <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
                                        <h2 className="font-serif text-xl text-primary">Order Summary</h2>
                                        <div className="my-5 h-px bg-border" />
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <span>Items ({itemCount})</span>
                                            <span>Rs. {subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between font-semibold text-primary text-lg">
                                            <span>Subtotal</span>
                                            <span className="text-accent-gold">Rs. {subtotal.toFixed(2)}</span>
                                        </div>
                                        <p className="mt-2 text-[11px] text-muted-foreground">
                                            Shipping and taxes calculated at checkout.
                                        </p>
                                        <ProceedToCheckoutButton />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

function EmptyCart() {
    return (
        <div className="flex flex-col items-center text-center py-16">
            <div className="w-20 h-20 grid place-items-center rounded-full bg-sage text-primary">
                <ShoppingBag className="w-9 h-9" />
            </div>
            <h2 className="mt-6 font-serif text-2xl text-primary">Your cart is empty</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                Looks like you haven&apos;t added anything yet. Explore our collection to find your next favorite.
            </p>
            <Link
                href="/products"
                className="mt-8 inline-flex items-center justify-center px-7 h-12 rounded-full bg-primary hover:bg-primary-light text-primary-foreground font-semibold uppercase tracking-[0.16em] text-[12px] transition shadow-card"
            >
                Continue Shopping
            </Link>
        </div>
    )
}

function CartLine({
    item,
    onIncrease,
    onDecrease,
    onRemove,
}: {
    item: { productId: string; productName: string; productImage: string; selectedSize?: string; quantity: number; priceAtAddTime: number }
    onIncrease: () => void
    onDecrease: () => void
    onRemove: () => void
}) {
    const lineTotal = item.priceAtAddTime * item.quantity

    return (
        <div className="flex gap-4 bg-white rounded-2xl shadow-card p-4">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-cream shrink-0">
                {item.productImage && (
                    <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                )}
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="font-serif text-base sm:text-lg text-primary truncate">{item.productName}</h3>
                        {item.selectedSize && (
                            <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                Size: {item.selectedSize}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onRemove}
                        aria-label={`Remove ${item.productName} from cart`}
                        className="text-muted-foreground hover:text-red-500 transition shrink-0"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                <div className="mt-auto flex items-end justify-between gap-3 pt-3">
                    <div className="flex items-center gap-3 border border-border rounded-full px-1 h-9">
                        <button
                            onClick={onDecrease}
                            aria-label="Decrease quantity"
                            className="w-7 h-7 grid place-items-center rounded-full hover:bg-sage transition"
                        >
                            <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-5 text-center text-sm font-semibold text-primary">{item.quantity}</span>
                        <button
                            onClick={onIncrease}
                            aria-label="Increase quantity"
                            className="w-7 h-7 grid place-items-center rounded-full hover:bg-sage transition"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="text-right">
                        <p className="text-[11px] text-muted-foreground">Rs. {item.priceAtAddTime.toFixed(2)} each</p>
                        <p className="font-semibold text-accent-gold">Rs. {lineTotal.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ProceedToCheckoutButton() {
    return (
        <Link
            href="/checkout"
            className="mt-6 w-full flex items-center justify-center h-14 rounded-full bg-primary hover:bg-primary-light text-primary-foreground font-semibold uppercase tracking-[0.16em] text-[12px] transition shadow-card"
        >
            Proceed to Checkout
        </Link>
    )
}
