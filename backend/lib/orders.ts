import connectDB from './mongodb'
import Order, { OrderStatus, ORDER_STATUSES } from './models/Order'
import Product from './models/Product'
import { generateOrderNumber } from './order-number'
import { CreateOrderInput } from './order-validation'

export interface Order {
    id: string
    orderNumber: string
    customer: { name: string; phone: string; email?: string }
    shippingAddress: { addressLine: string; city: string; state: string; pincode: string }
    items: { productId: string; name: string; price: number; quantity: number; subtotal: number; selectedSize?: string }[]
    subtotal: number
    shipping: number
    total: number
    paymentMethod?: string
    paymentStatus: string
    status: string
    razorpayOrderId?: string
    razorpayPaymentId?: string
    createdAt: string
    updatedAt: string
}

function toOrder(doc: any): Order {
    return {
        ...doc,
        id: doc._id ? doc._id.toString() : doc.id
    } as Order
}

export class ProductNotFoundError extends Error {
    constructor(productId: string) {
        super(`Product not found: ${productId}`)
        this.name = 'ProductNotFoundError'
    }
}

// Recomputes item prices/subtotal/total from the live Product collection —
// client-submitted prices are never trusted (see docs/direct-checkout-architecture.md §11).
export async function createOrder(input: CreateOrderInput): Promise<Order> {
    await connectDB()

    const products = await Promise.all(
        input.items.map(async (item) => {
            const product = await Product.findById(item.productId).lean()
            if (!product) throw new ProductNotFoundError(item.productId)
            return { product: product as any, quantity: item.quantity, selectedSize: item.selectedSize }
        })
    )

    const items = products.map(({ product, quantity, selectedSize }) => {
        const price = product.price
        return {
            productId: product._id.toString(),
            name: product.name,
            price,
            quantity,
            subtotal: price * quantity,
            selectedSize
        }
    })

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
    const shipping = input.shipping ?? 0
    const total = subtotal + shipping

    const orderNumber = await generateOrderNumber()
    const now = new Date().toISOString()

    const newOrder = new Order({
        orderNumber,
        customer: input.customer,
        shippingAddress: input.shippingAddress,
        items,
        subtotal,
        shipping,
        total,
        paymentMethod: input.paymentMethod,
        paymentStatus: 'pending',
        status: 'New',
        createdAt: now,
        updatedAt: now
    })

    const saved = await newOrder.save()
    return toOrder(saved.toObject())
}

export async function getOrders(filter?: { status?: string; search?: string }): Promise<Order[]> {
    await connectDB()
    const query: any = {}
    if (filter?.status) query.status = filter.status
    if (filter?.search) {
        const pattern = filter.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const regex = new RegExp(pattern, 'i')
        query.$or = [
            { orderNumber: regex },
            { 'customer.name': regex },
            { 'customer.phone': regex },
            { 'customer.email': regex }
        ]
    }
    const orders = await Order.find(query).sort({ createdAt: -1 }).lean()
    return orders.map(toOrder)
}

export async function getOrderById(id: string): Promise<Order | null> {
    await connectDB()
    const order = await Order.findById(id).lean()
    if (!order) return null
    return toOrder(order)
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
    await connectDB()
    if (!ORDER_STATUSES.includes(status)) {
        throw new Error(`Invalid order status: ${status}`)
    }
    const order = await Order.findByIdAndUpdate(
        id,
        { $set: { status, updatedAt: new Date().toISOString() } },
        { new: true }
    ).lean()
    if (!order) return null
    return toOrder(order)
}

export async function findOrderByRazorpayOrderId(razorpayOrderId: string): Promise<Order | null> {
    await connectDB()
    const order = await Order.findOne({ razorpayOrderId }).lean()
    if (!order) return null
    return toOrder(order)
}

// Applies a verified payment webhook event to its Order. Idempotent: once an
// order's paymentStatus has left 'pending' it is never overwritten again, so
// gateway retry deliveries of the same (or a later) event are safe no-ops.
export async function applyPaymentResult(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    outcome: 'paid' | 'failed'
): Promise<Order | null> {
    await connectDB()

    const order = await Order.findOne({ razorpayOrderId })
    if (!order) return null

    if (order.paymentStatus !== 'pending') {
        return toOrder(order.toObject())
    }

    order.paymentStatus = outcome
    order.razorpayPaymentId = razorpayPaymentId
    if (outcome === 'paid' && order.status === 'New') {
        order.status = 'Confirmed'
    }
    order.updatedAt = new Date().toISOString()
    await order.save()

    return toOrder(order.toObject())
}
