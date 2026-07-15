const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://auraava-api.onrender.com'

export async function api(path: string, options?: RequestInit) {
    const url = `${API_BASE}${path}`
    const res = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    })
    return res
}

export async function apiGet(path: string) {
    return api(path)
}

export async function apiPost(path: string, body?: unknown) {
    return api(path, {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
    })
}

export async function apiPut(path: string, body?: unknown) {
    return api(path, {
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
    })
}

export async function apiDelete(path: string) {
    return api(path, { method: 'DELETE' })
}
