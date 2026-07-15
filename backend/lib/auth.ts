import { SignJWT, jwtVerify } from 'jose'

const SECRET_KEY = process.env.JWT_SECRET
const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

if (!SECRET_KEY || !ADMIN_USERNAME || !ADMIN_PASSWORD) {
    throw new Error(
        'Missing required env vars: JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD must all be set. See backend/.env.example.'
    )
}

export interface SessionData {
    username: string
    isAdmin: boolean
    exp: number
}

// Create JWT token
export async function createToken(username: string): Promise<string> {
    const secret = new TextEncoder().encode(SECRET_KEY)
    const token = await new SignJWT({ username, isAdmin: true })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(secret)
    return token
}

// Verify JWT token
export async function verifyToken(token: string): Promise<SessionData | null> {
    try {
        const secret = new TextEncoder().encode(SECRET_KEY)
        const { payload } = await jwtVerify(token, secret)

        // Validate that required properties exist
        if (typeof payload.username !== 'string' || typeof payload.isAdmin !== 'boolean') {
            return null
        }

        return {
            username: payload.username,
            isAdmin: payload.isAdmin,
            exp: payload.exp as number
        }
    } catch (error) {
        return null
    }
}

// Validate admin credentials
export function validateCredentials(username: string, password: string): boolean {
    return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

