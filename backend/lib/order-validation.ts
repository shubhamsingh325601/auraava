export interface CreateOrderInput {
    customer: {
        name: string
        phone: string
        email?: string
    }
    shippingAddress: {
        addressLine: string
        city: string
        state: string
        pincode: string
    }
    items: { productId: string; quantity: number; selectedSize?: string }[]
    shipping?: number
    paymentMethod?: string
}

const PHONE_REGEX = /^[6-9]\d{9}$/
const PINCODE_REGEX = /^\d{6}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateCreateOrderInput(body: any): { valid: true; data: CreateOrderInput } | { valid: false; errors: string[] } {
    const errors: string[] = []
    const customer = body?.customer ?? {}
    const shippingAddress = body?.shippingAddress ?? {}
    const items = body?.items

    if (!customer.name || typeof customer.name !== 'string' || !customer.name.trim()) {
        errors.push('customer.name is required')
    }
    if (!customer.phone || typeof customer.phone !== 'string' || !PHONE_REGEX.test(customer.phone.trim())) {
        errors.push('customer.phone must be a valid 10-digit mobile number')
    }
    if (customer.email && (typeof customer.email !== 'string' || !EMAIL_REGEX.test(customer.email.trim()))) {
        errors.push('customer.email must be a valid email address')
    }

    if (!shippingAddress.addressLine || typeof shippingAddress.addressLine !== 'string' || !shippingAddress.addressLine.trim()) {
        errors.push('shippingAddress.addressLine is required')
    }
    if (!shippingAddress.city || typeof shippingAddress.city !== 'string' || !shippingAddress.city.trim()) {
        errors.push('shippingAddress.city is required')
    }
    if (!shippingAddress.state || typeof shippingAddress.state !== 'string' || !shippingAddress.state.trim()) {
        errors.push('shippingAddress.state is required')
    }
    if (!shippingAddress.pincode || typeof shippingAddress.pincode !== 'string' || !PINCODE_REGEX.test(shippingAddress.pincode.trim())) {
        errors.push('shippingAddress.pincode must be a valid 6-digit PIN code')
    }

    if (!Array.isArray(items) || items.length === 0) {
        errors.push('items must be a non-empty array')
    } else {
        items.forEach((item: any, idx: number) => {
            if (!item?.productId || typeof item.productId !== 'string') {
                errors.push(`items[${idx}].productId is required`)
            }
            if (typeof item?.quantity !== 'number' || !Number.isInteger(item.quantity) || item.quantity < 1) {
                errors.push(`items[${idx}].quantity must be a positive integer`)
            }
            if (item?.selectedSize !== undefined && typeof item.selectedSize !== 'string') {
                errors.push(`items[${idx}].selectedSize must be a string`)
            }
        })
    }

    if (body?.shipping !== undefined && (typeof body.shipping !== 'number' || body.shipping < 0)) {
        errors.push('shipping must be a non-negative number')
    }

    if (errors.length > 0) {
        return { valid: false, errors }
    }

    return {
        valid: true,
        data: {
            customer: {
                name: customer.name.trim(),
                phone: customer.phone.trim(),
                email: customer.email ? customer.email.trim() : undefined
            },
            shippingAddress: {
                addressLine: shippingAddress.addressLine.trim(),
                city: shippingAddress.city.trim(),
                state: shippingAddress.state.trim(),
                pincode: shippingAddress.pincode.trim()
            },
            items: items.map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
                selectedSize: typeof item.selectedSize === 'string' ? item.selectedSize.trim() || undefined : undefined
            })),
            shipping: body.shipping ?? 0,
            paymentMethod: typeof body?.paymentMethod === 'string' ? body.paymentMethod : undefined
        }
    }
}
