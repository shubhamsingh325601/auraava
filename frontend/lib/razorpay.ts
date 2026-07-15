export interface RazorpayPaymentResponse {
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
}

export interface RazorpayFailureResponse {
    error: {
        code: string
        description: string
        reason?: string
    }
}

export interface RazorpayOptions {
    key: string
    amount: number
    currency: string
    name: string
    description?: string
    order_id: string
    handler: (response: RazorpayPaymentResponse) => void
    prefill?: { name?: string; email?: string; contact?: string }
    theme?: { color?: string }
    modal?: { ondismiss?: () => void }
}

interface RazorpayInstance {
    open: () => void
    on: (event: "payment.failed", handler: (response: RazorpayFailureResponse) => void) => void
}

declare global {
    interface Window {
        Razorpay?: new (options: RazorpayOptions) => RazorpayInstance
    }
}

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js"

let loadPromise: Promise<boolean> | null = null

// Loads Razorpay's Checkout.js exactly once, resolving false (never
// rejecting) if the script fails to load — e.g. offline, or blocked by an ad
// blocker — so callers can fall back to a friendly message instead of a crash.
export function loadRazorpayScript(): Promise<boolean> {
    if (typeof window === "undefined") return Promise.resolve(false)
    if (window.Razorpay) return Promise.resolve(true)
    if (loadPromise) return loadPromise

    loadPromise = new Promise((resolve) => {
        const script = document.createElement("script")
        script.src = SCRIPT_SRC
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })

    return loadPromise
}

export function openRazorpayCheckout(options: RazorpayOptions): RazorpayInstance | null {
    if (typeof window === "undefined" || !window.Razorpay) return null
    const instance = new window.Razorpay(options)
    instance.open()
    return instance
}
