"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Lock, User, AlertCircle, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminLoginPage() {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            })

            const data = await res.json()

            if (res.ok) {
                if (data.token) {
                    document.cookie = `admin-session=${data.token}; path=/; max-age=86400; SameSite=Lax; Secure`
                }
                window.location.href = '/admin'
            } else {
                setError(data.error || 'Invalid credentials')
            }
        } catch (error) {
            setError('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-deep flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Login Card */}
                <div className="bg-cream rounded-2xl shadow-hover overflow-hidden">
                    {/* Header */}
                    <div className="p-8 text-center">
                        <span className="font-display text-3xl font-bold tracking-tight text-primary">
                            Auraava <span className="text-accent-gold">✦</span>
                        </span>
                        <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                            Admin Panel
                        </p>
                    </div>

                    {/* Form */}
                    <div className="px-8 pb-8">
                        {error && (
                            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-destructive">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username Field */}
                            <div>
                                <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                        placeholder="Enter your username"
                                        autoComplete="username"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-12 py-3 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-full bg-primary hover:bg-primary-light text-primary-foreground py-3 h-11 text-[11px] uppercase tracking-[0.16em] font-semibold"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Signing in...
                                    </span>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </form>

                        {/* Security Note */}
                        <div className="mt-6 pt-6 border-t border-border">
                            <p className="text-xs text-center text-muted-foreground">
                                🔒 Secure admin access • Protected by authentication
                            </p>
                        </div>
                    </div>
                </div>

                {/* Back to Website Link */}
                <div className="text-center mt-6">
                    <a
                        href="/"
                        className="text-sm text-ivory/70 hover:text-ivory transition-colors"
                    >
                        ← Back to Website
                    </a>
                </div>
            </div>
        </div>
    )
}

