import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
    return proxyRequest(request, params.path, 'GET')
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
    return proxyRequest(request, params.path, 'POST')
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
    return proxyRequest(request, params.path, 'PUT')
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
    return proxyRequest(request, params.path, 'DELETE')
}

export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
    return proxyRequest(request, params.path, 'PATCH')
}

async function proxyRequest(request: NextRequest, path: string[], method: string) {
    try {
        const pathname = path.join('/')
        const search = request.nextUrl.search
        const url = `${BACKEND_URL}/api/${pathname}${search}`

        const body = method !== 'GET' && method !== 'HEAD' ? await request.text() : undefined

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': request.headers.get('Content-Type') || 'application/json',
                'Cookie': request.headers.get('Cookie') || '',
            },
            body,
        })

        const responseBody = await response.text()

        const headers = new Headers()
        response.headers.forEach((value, key) => {
            if (key.toLowerCase() !== 'set-cookie') {
                headers.set(key, value)
            }
        })

        const setCookie = response.headers.get('set-cookie')
        if (setCookie) {
            headers.set('set-cookie', setCookie)
        }

        return new NextResponse(responseBody, {
            status: response.status,
            headers,
        })
    } catch (error) {
        console.error(`Proxy error for /api/${path.join('/')}:`, error)
        return NextResponse.json(
            { error: 'Backend unavailable. Please try again.' },
            { status: 503 }
        )
    }
}
