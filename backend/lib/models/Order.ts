import mongoose, { Schema, Document } from 'mongoose'

export interface IOrderCustomer {
    name: string
    phone: string
    email?: string
}

export interface IOrderShippingAddress {
    addressLine: string
    city: string
    state: string
    pincode: string
}

export interface IOrderItem {
    productId: string
    name: string
    price: number
    quantity: number
    subtotal: number
    selectedSize?: string
}

export const ORDER_PAYMENT_STATUSES = ['pending', 'paid', 'failed'] as const
export type OrderPaymentStatus = typeof ORDER_PAYMENT_STATUSES[number]

export const ORDER_STATUSES = ['New', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const
export type OrderStatus = typeof ORDER_STATUSES[number]

export interface IOrder extends Document {
    id: string
    orderNumber: string
    customer: IOrderCustomer
    shippingAddress: IOrderShippingAddress
    items: IOrderItem[]
    subtotal: number
    shipping: number
    total: number
    paymentMethod?: string
    paymentStatus: OrderPaymentStatus
    status: OrderStatus
    razorpayOrderId?: string
    razorpayPaymentId?: string
    createdAt: string
    updatedAt: string
}

const OrderItemSchema = new Schema<IOrderItem>({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    selectedSize: { type: String }
}, { _id: false })

const OrderSchema = new Schema<IOrder>({
    orderNumber: { type: String, required: true, unique: true },
    customer: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String }
    },
    shippingAddress: {
        addressLine: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true }
    },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String },
    paymentStatus: { type: String, enum: ORDER_PAYMENT_STATUSES, default: 'pending' },
    status: { type: String, enum: ORDER_STATUSES, default: 'New' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() }
}, {
    timestamps: false,
    toJSON: {
        transform: function(doc, ret: any) {
            ret.id = ret._id.toString()
            delete ret._id
            delete ret.__v
            return ret
        }
    }
})

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)
