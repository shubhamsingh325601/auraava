import { SignJWT, jwtVerify } from 'jose'

const SECRET_KEY = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'

// Verify JWT token (for frontend middleware)
export async function verifyToken(token: string) {
    try {
        const secret = new TextEncoder().encode(SECRET_KEY)
        const { payload } = await jwtVerify(token, secret)
        return payload
    } catch (error) {
        return null
    }
}

// Check authentication status by calling backend API
export async function checkAuth(): Promise<{ authenticated: boolean; username?: string }> {
    try {
        const response = await fetch('/api/auth/check', {
            credentials: 'include',
        })
        if (!response.ok) {
            return { authenticated: false }
        }
        const data = await response.json()
        return data
    } catch (error) {
        return { authenticated: false }
    }
}






