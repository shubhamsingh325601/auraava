"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"

export interface CartItem {
    productId: string
    productName: string
    productImage: string
    selectedSize?: string
    quantity: number
    priceAtAddTime: number
}

interface CartContextValue {
    items: CartItem[]
    isHydrated: boolean
    addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
    removeItem: (productId: string, selectedSize?: string) => void
    updateQuantity: (productId: string, quantity: number, selectedSize?: string) => void
    increaseQuantity: (productId: string, selectedSize?: string) => void
    decreaseQuantity: (productId: string, selectedSize?: string) => void
    clearCart: () => void
    subtotal: number
    itemCount: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const STORAGE_KEY = "auraava_cart"

function sameLine(a: Pick<CartItem, "productId" | "selectedSize">, b: Pick<CartItem, "productId" | "selectedSize">) {
    return a.productId === b.productId && a.selectedSize === b.selectedSize
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isHydrated, setIsHydrated] = useState(false)

    // Hydrate from localStorage after mount to avoid SSR/client markup mismatches
    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY)
            if (raw) {
                const parsed = JSON.parse(raw)
                if (Array.isArray(parsed)) setItems(parsed)
            }
        } catch {
            // ignore corrupt storage
        } finally {
            setIsHydrated(true)
        }
    }, [])

    // Persist after hydration so the initial hydrate doesn't overwrite storage with []
    useEffect(() => {
        if (!isHydrated) return
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
        } catch {
            // ignore write failures (e.g. storage disabled)
        }
    }, [items, isHydrated])

    const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity: number = 1) => {
        setItems((prev) => {
            const existingIndex = prev.findIndex((line) => sameLine(line, item))
            if (existingIndex !== -1) {
                const next = [...prev]
                next[existingIndex] = {
                    ...next[existingIndex],
                    quantity: next[existingIndex].quantity + quantity,
                }
                return next
            }
            return [...prev, { ...item, quantity }]
        })
    }, [])

    const removeItem = useCallback((productId: string, selectedSize?: string) => {
        setItems((prev) => prev.filter((line) => !sameLine(line, { productId, selectedSize })))
    }, [])

    const updateQuantity = useCallback((productId: string, quantity: number, selectedSize?: string) => {
        setItems((prev) => {
            if (quantity <= 0) {
                return prev.filter((line) => !sameLine(line, { productId, selectedSize }))
            }
            return prev.map((line) =>
                sameLine(line, { productId, selectedSize }) ? { ...line, quantity } : line
            )
        })
    }, [])

    const increaseQuantity = useCallback((productId: string, selectedSize?: string) => {
        setItems((prev) =>
            prev.map((line) =>
                sameLine(line, { productId, selectedSize }) ? { ...line, quantity: line.quantity + 1 } : line
            )
        )
    }, [])

    const decreaseQuantity = useCallback((productId: string, selectedSize?: string) => {
        setItems((prev) =>
            prev
                .map((line) =>
                    sameLine(line, { productId, selectedSize }) ? { ...line, quantity: line.quantity - 1 } : line
                )
                .filter((line) => line.quantity > 0)
        )
    }, [])

    const clearCart = useCallback(() => {
        setItems([])
    }, [])

    const subtotal = useMemo(
        () => items.reduce((sum, line) => sum + line.priceAtAddTime * line.quantity, 0),
        [items]
    )

    const itemCount = useMemo(
        () => items.reduce((sum, line) => sum + line.quantity, 0),
        [items]
    )

    const value: CartContextValue = {
        items,
        isHydrated,
        addItem,
        removeItem,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        subtotal,
        itemCount,
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
    const ctx = useContext(CartContext)
    if (!ctx) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return ctx
}
