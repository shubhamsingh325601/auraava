"use client"

export type PaymentAvailability = "checking" | "available" | "unavailable"

interface PaymentMethodProps {
    availability: PaymentAvailability
}

export default function PaymentMethod({ availability }: PaymentMethodProps) {
    return (
        <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="font-serif text-xl text-primary">Payment Method</h2>
            <div className="my-5 h-px bg-border" />

            <label className="flex items-center gap-3 p-4 rounded-lg border border-accent-gold bg-accent-blush/40 cursor-not-allowed">
                <input
                    type="radio"
                    name="paymentMethod"
                    checked
                    readOnly
                    className="w-4 h-4 accent-accent-gold"
                />
                <span className="text-sm font-medium text-primary">Online Payment (Razorpay)</span>
            </label>

            {availability === "checking" && (
                <p className="mt-3 text-[11px] text-muted-foreground">
                    Checking payment availability...
                </p>
            )}
            {availability === "available" && (
                <p className="mt-3 text-[11px] text-muted-foreground">
                    You&apos;ll be taken to a secure Razorpay window to complete payment after placing your order.
                </p>
            )}
            {availability === "unavailable" && (
                <p className="mt-3 text-[11px] text-muted-foreground">
                    Online payment is temporarily unavailable. You can still place your order — our team will reach out to arrange payment.
                </p>
            )}
        </div>
    )
}
