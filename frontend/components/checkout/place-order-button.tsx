"use client"

interface PlaceOrderButtonProps {
    onPlaceOrder: () => void
    isSubmitting?: boolean
}

export default function PlaceOrderButton({ onPlaceOrder, isSubmitting = false }: PlaceOrderButtonProps) {
    return (
        <button
            type="button"
            onClick={onPlaceOrder}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="mt-6 w-full flex items-center justify-center h-14 rounded-full bg-primary hover:bg-primary-light text-primary-foreground font-semibold uppercase tracking-[0.16em] text-[12px] transition shadow-card disabled:opacity-60 disabled:cursor-not-allowed"
        >
            {isSubmitting ? "Placing Order..." : "Place Order"}
        </button>
    )
}
