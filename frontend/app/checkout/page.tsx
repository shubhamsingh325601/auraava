"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import PageHero from "@/components/layout/page-hero"
import { useCart } from "@/lib/cart-context"
import CheckoutForm, {
    CheckoutFormValues,
    EMPTY_CHECKOUT_FORM,
    validateCheckoutForm,
} from "@/components/checkout/checkout-form"
import OrderSummary from "@/components/checkout/order-summary"
import PaymentMethod, { PaymentAvailability } from "@/components/checkout/payment-method"
import PlaceOrderButton from "@/components/checkout/place-order-button"
import { loadRazorpayScript, openRazorpayCheckout } from "@/lib/razorpay"

const SHIPPING_COST = 0

export default function CheckoutPage() {
    const router = useRouter()
    const { items, isHydrated, subtotal, clearCart } = useCart()
    const [values, setValues] = useState<CheckoutFormValues>(EMPTY_CHECKOUT_FORM)
    const [errors, setErrors] = useState<ReturnType<typeof validateCheckoutForm>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [paymentAvailability, setPaymentAvailability] = useState<PaymentAvailability>("checking")

    const total = subtotal + SHIPPING_COST

    useEffect(() => {
        let cancelled = false

        async function checkPaymentAvailability() {
            try {
                const response = await fetch("/api/checkout/razorpay/config")
                const data = await response.json().catch(() => null)
                if (cancelled) return
                setPaymentAvailability(response.ok && data?.configured ? "available" : "unavailable")
            } catch {
                if (!cancelled) setPaymentAvailability("unavailable")
            }
        }

        checkPaymentAvailability()
        return () => {
            cancelled = true
        }
    }, [])

    const handleFieldChange = (field: keyof CheckoutFormValues, value: string) => {
        setValues((prev) => ({ ...prev, [field]: value }))
        setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    const handlePlaceOrder = async () => {
        if (isSubmitting) return

        const validationErrors = validateCheckoutForm(values)
        setErrors(validationErrors)
        if (Object.keys(validationErrors).length > 0) return

        setSubmitError(null)
        setIsSubmitting(true)

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customer: {
                        name: values.fullName.trim(),
                        phone: values.mobileNumber.trim(),
                        email: values.email.trim() || undefined,
                    },
                    shippingAddress: {
                        addressLine: values.addressLine.trim(),
                        city: values.city.trim(),
                        state: values.state.trim(),
                        pincode: values.pincode.trim(),
                    },
                    items: items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        selectedSize: item.selectedSize,
                    })),
                    shipping: SHIPPING_COST,
                }),
            })

            const data = await response.json().catch(() => null)

            if (!response.ok || !data?.order) {
                setSubmitError(
                    data?.error ?? "We couldn't place your order. Please check your details and try again."
                )
                return
            }

            const order = data.order as { id: string; orderNumber: string; total: number }
            clearCart()

            if (paymentAvailability !== "available") {
                router.push(`/order-confirmation/${order.id}`)
                return
            }

            await startRazorpayPayment(order)
        } catch {
            setSubmitError("We couldn't reach the server. Please check your connection and try again.")
            setIsSubmitting(false)
        }
    }

    const startRazorpayPayment = async (order: { id: string; orderNumber: string; total: number }) => {
        const scriptLoaded = await loadRazorpayScript()
        if (!scriptLoaded) {
            setSubmitError(
                "We couldn't load the payment window. Your order has been saved — you can view it below and complete payment later."
            )
            router.push(`/order-confirmation/${order.id}`)
            return
        }

        try {
            const initResponse = await fetch("/api/checkout/razorpay/init", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: order.id }),
            })
            const initData = await initResponse.json().catch(() => null)

            if (!initResponse.ok || !initData?.key) {
                // Order is already saved (pending payment) — send the customer to
                // the confirmation page instead of leaving them stuck on checkout.
                router.push(`/order-confirmation/${order.id}`)
                return
            }

            const instance = openRazorpayCheckout({
                key: initData.key,
                amount: initData.amount,
                currency: initData.currency,
                name: "Auraava",
                description: `Order ${initData.orderNumber}`,
                order_id: initData.razorpayOrderId,
                prefill: {
                    name: values.fullName.trim(),
                    email: values.email.trim() || undefined,
                    contact: values.mobileNumber.trim(),
                },
                theme: { color: "#7a5c3e" },
                handler: () => {
                    router.push(`/order-confirmation/${order.id}`)
                },
                modal: {
                    ondismiss: () => {
                        setIsSubmitting(false)
                        setSubmitError(
                            `Payment window closed. Your order ${order.orderNumber} has been saved as pending — view it any time from the confirmation page.`
                        )
                    },
                },
            })

            instance?.on("payment.failed", (response) => {
                setIsSubmitting(false)
                setSubmitError(
                    `Payment failed: ${response.error.description || "please try again"}. Your order ${order.orderNumber} has been saved as pending.`
                )
            })
        } catch {
            router.push(`/order-confirmation/${order.id}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-ivory">
            <Header />

            <main>
                <PageHero
                    eyebrow="Almost There"
                    title="Checkout"
                    breadcrumb={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]}
                />

                <section className="section-pad bg-ivory">
                    <div className="container-x max-w-5xl">
                        {!isHydrated ? (
                            <div className="text-center py-20 text-muted-foreground">Loading checkout...</div>
                        ) : items.length === 0 ? (
                            <EmptyCheckout />
                        ) : (
                            <div className="grid lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <CheckoutForm values={values} errors={errors} onChange={handleFieldChange} />
                                </div>

                                <div className="lg:col-span-1 space-y-6">
                                    <div className="sticky top-24 space-y-6">
                                        <OrderSummary
                                            items={items}
                                            subtotal={subtotal}
                                            shipping={SHIPPING_COST}
                                            total={total}
                                        />
                                        <PaymentMethod availability={paymentAvailability} />
                                        <PlaceOrderButton onPlaceOrder={handlePlaceOrder} isSubmitting={isSubmitting} />
                                        {submitError && (
                                            <p className="text-center text-xs text-destructive">
                                                {submitError}
                                            </p>
                                        )}
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

function EmptyCheckout() {
    return (
        <div className="flex flex-col items-center text-center py-16">
            <div className="w-20 h-20 grid place-items-center rounded-full bg-sage text-primary">
                <ShoppingBag className="w-9 h-9" />
            </div>
            <h2 className="mt-6 font-serif text-2xl text-primary">Your cart is empty</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                Add a few products to your cart before proceeding to checkout.
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
