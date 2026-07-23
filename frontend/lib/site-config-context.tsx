"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { BRAND } from "./site-config"

interface SiteContact {
    whatsappNumber: string
    phone: string
}

const SiteContactContext = createContext<SiteContact>({
    whatsappNumber: BRAND.whatsappNumber,
    phone: BRAND.phone,
})

export function SiteContactProvider({ children }: { children: ReactNode }) {
    const [contact, setContact] = useState<SiteContact>({
        whatsappNumber: BRAND.whatsappNumber,
        phone: BRAND.phone,
    })

    useEffect(() => {
        fetch("/api/settings")
            .then((res) => res.json())
            .then((data) => {
                setContact({
                    whatsappNumber: data.whatsappNumber || BRAND.whatsappNumber,
                    phone: data.contactPhone || BRAND.phone,
                })
            })
            .catch(() => {
                // Keep the BRAND defaults if the settings fetch fails.
            })
    }, [])

    return <SiteContactContext.Provider value={contact}>{children}</SiteContactContext.Provider>
}

export function useSiteContact() {
    return useContext(SiteContactContext)
}

export function useWaLink() {
    const { whatsappNumber } = useSiteContact()
    return (message: string, phone: string = whatsappNumber) =>
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
