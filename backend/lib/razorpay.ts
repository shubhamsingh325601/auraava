import Razorpay from 'razorpay'
import crypto from 'crypto'

let client: Razorpay | null = null

// Thrown whenever Razorpay credentials are absent, so callers can tell "not
// configured yet" apart from a genuine Razorpay API failure and respond
// gracefully instead of crashing or returning a generic 500.
export class RazorpayNotConfiguredError extends Error {
    constructor() {
        super('Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to enable online payments.')
        this.name = 'RazorpayNotConfiguredError'
    }
}

export function isRazorpayConfigured(): boolean {
    return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
}

// Lazily constructed so a missing key at import time doesn't crash routes
// that don't need Razorpay (env is validated only when this is first used).
function getClient(): Razorpay {
    if (client) return client

    const key_id = process.env.RAZORPAY_KEY_ID
    const key_secret = process.env.RAZORPAY_KEY_SECRET
    if (!key_id || !key_secret) {
        throw new RazorpayNotConfiguredError()
    }

    client = new Razorpay({ key_id, key_secret })
    return client
}

export interface CreateRazorpayOrderInput {
    amount: number // in the smallest currency unit (paise for INR)
    currency: string
    receipt: string
}

export interface RazorpayOrderResult {
    id: string
    amount: number
    currency: string
}

export async function createRazorpayOrder(input: CreateRazorpayOrderInput): Promise<RazorpayOrderResult> {
    const razorpayOrder = await getClient().orders.create({
        amount: input.amount,
        currency: input.currency,
        receipt: input.receipt
    })

    return {
        id: razorpayOrder.id,
        amount: Number(razorpayOrder.amount),
        currency: razorpayOrder.currency
    }
}

export function getRazorpayKeyId(): string {
    const key_id = process.env.RAZORPAY_KEY_ID
    if (!key_id) {
        throw new RazorpayNotConfiguredError()
    }
    return key_id
}

export function isWebhookConfigured(): boolean {
    return Boolean(process.env.RAZORPAY_WEBHOOK_SECRET)
}

// Verifies the X-Razorpay-Signature header against the raw request body per
// Razorpay's webhook spec: HMAC-SHA256 of the raw payload, keyed with the
// dashboard-configured webhook secret. Returns false (never throws) if the
// secret is missing or the signature doesn't match, so callers always reject
// safely instead of trusting an unverifiable payload.
export function verifyWebhookSignature(rawBody: Buffer, signature: string | undefined): boolean {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET
    if (!secret || !signature) return false

    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')

    const expectedBuf = Buffer.from(expected, 'utf8')
    const actualBuf = Buffer.from(signature, 'utf8')
    if (expectedBuf.length !== actualBuf.length) return false

    return crypto.timingSafeEqual(expectedBuf, actualBuf)
}
