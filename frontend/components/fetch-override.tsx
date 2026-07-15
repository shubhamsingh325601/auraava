'use client'

import { useEffect } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://auraava-api.onrender.com'

export default function FetchOverride() {
    useEffect(() => {
        const origFetch = window.fetch.bind(window)
        window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
            if (typeof input === 'string' && input.startsWith('/api/')) {
                input = `${API_BASE}${input}`
            } else if (input instanceof Request && input.url.startsWith('/api/')) {
                input = new Request(`${API_BASE}${input.url}`, input)
            }
            return origFetch(input, init)
        }
    }, [])

    return null
}
