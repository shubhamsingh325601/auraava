import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://auraava-api.onrender.com'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (pathname === '/admin/login') {
        return NextResponse.next()
    }

    if (pathname.startsWith('/admin')) {
        const token = request.cookies.get('admin-session')?.value

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        try {
            const res = await fetch(`${API_BASE}/api/auth/check`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (!res.ok) {
                return NextResponse.redirect(new URL('/admin/login', request.url))
            }
        } catch {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin', '/admin/:path*'],
}

