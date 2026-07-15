"use client"

import { useRouter } from "next/navigation"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart-context"

interface BuyNowButtonProps {
    productId: string
    productName: string
    productImage: string
    price: number
    selectedSize?: string
}

export default function BuyNowButton({ productId, productName, productImage, price, selectedSize }: BuyNowButtonProps) {
    const router = useRouter()
    const { addItem } = useCart()

    const handleBuyNow = () => {
        addItem({ productId, productName, productImage, selectedSize, priceAtAddTime: price })
        router.push("/cart")
    }

    return (
        <button
            onClick={handleBuyNow}
            className="w-full flex items-center justify-center gap-3 h-14 rounded-full bg-accent-gold hover:brightness-105 text-primary-foreground font-semibold uppercase tracking-[0.16em] text-[12px] transition shadow-card"
        >
            <ShoppingBag className="w-5 h-5" />
            Buy Directly
        </button>
    )
}
