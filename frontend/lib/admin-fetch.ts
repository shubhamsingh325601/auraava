// Wrapper around fetch() for admin API calls. The relative `/api/*` request is
// proxied same-origin to the backend, but that proxy hop doesn't reliably carry
// the `admin-session` cookie through to the backend's requireAdmin check, so we
// also attach it explicitly as a Bearer token — the same technique already used
// by ProtectedRoute and middleware.ts to validate the session itself.
function getAdminToken(): string | null {
    if (typeof document === "undefined") return null
    const match = document.cookie.match(/(?:^|; )admin-session=([^;]*)/)
    return match ? decodeURIComponent(match[1]) : null
}

export async function adminFetch(input: string, init: RequestInit = {}): Promise<Response> {
    const token = getAdminToken()
    const headers = new Headers(init.headers)
    if (token) headers.set("Authorization", `Bearer ${token}`)
    return fetch(input, { ...init, headers, credentials: "include" })
}
