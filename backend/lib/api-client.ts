// API client configuration
// This file helps manage the API base URL for the frontend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const apiClient = {
    baseURL: API_BASE_URL,
    
    async get(endpoint: string) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            credentials: 'include',
        })
        return response.json()
    },
    
    async post(endpoint: string, data: any) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        })
        return response.json()
    },
    
    async put(endpoint: string, data: any) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        })
        return response.json()
    },
    
    async delete(endpoint: string) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            credentials: 'include',
        })
        return response.json()
    },
}

export default apiClient

