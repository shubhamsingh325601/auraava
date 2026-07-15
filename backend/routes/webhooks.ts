import express, { Request, Response } from 'express'
import { verifyWebhookSignature, isWebhookConfigured } from '../lib/razorpay'
import { applyPaymentResult } from '../lib/orders'

const router = express.Router()

interface RazorpayWebhookPayload {
    event: string
    payload: {
        payment?: {
            entity: {
                id: string
                order_id: string
            }
        }
    }
}

// POST /api/webhooks/razorpay — signature-verified, idempotent payment webhook.
// Mounted in index.ts with express.raw() so req.body is the untouched Buffer
// the signature was computed over (must run before the global express.json()).
router.post('/razorpay', async (req: Request, res: Response) => {
    if (!isWebhookConfigured()) {
        console.error('Razorpay webhook received but RAZORPAY_WEBHOOK_SECRET is not set — rejecting.')
        return res.status(503).json({ error: 'Webhook not configured' })
    }

    const rawBody = req.body as Buffer
    const signature = req.header('x-razorpay-signature')

    if (!verifyWebhookSignature(rawBody, signature)) {
        console.error('Razorpay webhook signature verification failed — rejecting event.')
        return res.status(400).json({ error: 'Invalid signature' })
    }

    let event: RazorpayWebhookPayload
    try {
        event = JSON.parse(rawBody.toString('utf8'))
    } catch {
        return res.status(400).json({ error: 'Malformed payload' })
    }

    try {
        const payment = event.payload?.payment?.entity

        if (event.event === 'payment.captured' && payment) {
            await applyPaymentResult(payment.order_id, payment.id, 'paid')
        } else if (event.event === 'payment.failed' && payment) {
            await applyPaymentResult(payment.order_id, payment.id, 'failed')
        }
        // Other event types are acknowledged but not acted on.

        res.status(200).json({ received: true })
    } catch (error) {
        console.error('Error processing Razorpay webhook:', error)
        res.status(500).json({ error: 'Failed to process webhook' })
    }
})

export default router
