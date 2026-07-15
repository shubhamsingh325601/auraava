"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://auraava-api.onrender.com'

interface ProtectedRouteProps {
    children: React.ReactNode
}

function getCookie(name: string) {
    const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
    return m ? decodeURIComponent(m[1]) : null
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const token = getCookie('admin-session')

            if (!token) {
                setIsAuthenticated(false)
                router.push('/admin/login')
                return
            }

            const res = await fetch(`${API_BASE}/api/auth/check`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            })

            if (res.ok) {
                setIsAuthenticated(true)
            } else {
                setIsAuthenticated(false)
                router.push('/admin/login')
            }
        } catch (error) {
            console.error('Auth check failed:', error)
            setIsAuthenticated(false)
            router.push('/admin/login')
        }
    }

    // Loading state
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-ivory via-cream/40 to-ivory flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground font-sans">Verifying authentication...</p>
                </div>
            </div>
        )
    }

    // Not authenticated
    if (!isAuthenticated) {
        return null
    }

    // Authenticated
    return <>{children}</>
}

