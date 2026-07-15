import connectDB from './mongodb'
import Order from './models/Order'
import { createRazorpayOrder, getRazorpayKeyId } from './razorpay'

const CURRENCY = 'INR' // only currency in use today (see Product.currency default)

export class OrderNotFoundError extends Error {
    constructor(orderId: string) {
        super(`Order not found: ${orderId}`)
        this.name = 'OrderNotFoundError'
    }
}

export class OrderNotPendingError extends Error {
    constructor(orderId: string) {
        super(`Order ${orderId} is not awaiting payment`)
        this.name = 'OrderNotPendingError'
    }
}

export interface RazorpayInitResult {
    key: string
    razorpayOrderId: string
    amount: number
    currency: string
    orderNumber: string
}

// Creates a Razorpay Order for an existing, pending Order and records the
// razorpayOrderId on it. The amount is always taken from the Order document
// already persisted in MongoDB (computed server-side at order-creation time
// from live Product prices) — the client never supplies an amount here.
export async function initRazorpayCheckout(orderId: string): Promise<RazorpayInitResult> {
    await connectDB()

    const order = await Order.findById(orderId)
    if (!order) {
        throw new OrderNotFoundError(orderId)
    }
    if (order.paymentStatus !== 'pending') {
        throw new OrderNotPendingError(orderId)
    }

    const amountInPaise = Math.round(order.total * 100)

    const razorpayOrder = await createRazorpayOrder({
        amount: amountInPaise,
        currency: CURRENCY,
        receipt: order.orderNumber
    })

    order.razorpayOrderId = razorpayOrder.id
    order.updatedAt = new Date().toISOString()
    await order.save()

    return {
        key: getRazorpayKeyId(),
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        orderNumber: order.orderNumber
    }
}
