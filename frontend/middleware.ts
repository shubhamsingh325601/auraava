import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Allow access to login page
    if (pathname === '/admin/login') {
        return NextResponse.next()
    }

    // Protect all /admin routes except /admin/login
    if (pathname.startsWith('/admin')) {
        const token = request.cookies.get('admin-session')?.value

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        const session = await verifyToken(token)

        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin', '/admin/:path*'],
}

