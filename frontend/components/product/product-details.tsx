"use client"

import React from "react"
import {
    MessageCircle,
    Droplet,
    Sparkles,
    Dumbbell,
    Shield,
    Feather,
    HandMetal,
    Star,
    Heart,
    Leaf,
    Check
} from "lucide-react"
import BuyNowButton from "./buy-now-button"

// Helper function to format WhatsApp message
const formatWhatsAppMessage = (template: string, productName: string, price: number): string => {
    return template
        .replace(/{productName}/g, productName)
        .replace(/{price}/g, price.toString())
}

interface ProductDetailsProps {
    productId?: string
    mainImage?: string
    name: string
    description: string
    price: number
    category?: string
    rating?: number
    reviews?: number
    keyBenefits?: { label: string; icon: string }[]
    buttonText?: string
    buttonLink?: string
    whatsappPhoneNumber?: string
    whatsappMessageTemplate?: string
    directCheckoutEnabled?: boolean
}

const benefitIcons: Record<string, React.ComponentType<any>> = {
    droplet: Droplet,
    sparkles: Sparkles,
    dumbbell: Dumbbell,
    shield: Shield,
    feather: Feather,
    handMetal: HandMetal,
    star: Star,
    heart: Heart,
    leaf: Leaf,
    check: Check,
}

const CATEGORY_LABELS: Record<string, string> = {
    oils: "Hair Oils",
    shampoos: "Shampoos",
    serums: "Hair Serums",
    sprays: "Hair Sprays",
}

export default function ProductDetails({
    productId,
    mainImage,
    name,
    description,
    price,
    category,
    rating,
    reviews,
    keyBenefits = [],
    buttonText,
    buttonLink,
    whatsappPhoneNumber,
    whatsappMessageTemplate,
    directCheckoutEnabled,
}: ProductDetailsProps) {
    const handleWhatsAppClick = () => {
        // Use product-specific settings or fallback to defaults
        const phoneNumber = whatsappPhoneNumber || "919598028672"
        const template = whatsappMessageTemplate || "Hi! I'm interested in {productName} - Rs. {price}. Can you provide more details?"
        const message = formatWhatsAppMessage(template, name, price)
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
    }

    return (
        <div>
            {/* Category badge */}
            {category && (
                <span className="inline-block px-3 py-1 rounded-full bg-sage text-primary text-[10px] uppercase tracking-[0.18em] font-semibold">
                    {CATEGORY_LABELS[category] ?? category}
                </span>
            )}

            {/* Title */}
            <h1 className="mt-4 font-display font-bold text-3xl sm:text-4xl md:text-[36px] leading-tight text-primary">
                {name}
            </h1>

            {/* Rating */}
            {(rating !== undefined && rating > 0) && (
                <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center gap-0.5 text-accent-gold">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.round(rating) ? "fill-current" : "opacity-30"}`} />
                        ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                        {rating.toFixed(1)}{reviews !== undefined ? ` · ${reviews} reviews` : ""}
                    </span>
                </div>
            )}

            {/* Price */}
            <p className="mt-4 font-display font-bold text-[28px] sm:text-[32px] text-accent-gold">
                Rs. {price}
            </p>

            <div className="my-6 h-px bg-border" />

            {/* Description */}
            <p className="text-[15px] text-muted-foreground leading-relaxed">{description}</p>

            {/* Key Benefits */}
            {keyBenefits && keyBenefits.length > 0 && (
                <div className="mt-7">
                    <h2 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-primary">
                        Key Benefits
                    </h2>
                    <ul className="mt-4 grid sm:grid-cols-2 gap-3">
                        {keyBenefits.map((benefit, index) => {
                            const Icon = benefitIcons[benefit.icon] || Check
                            return (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="w-8 h-8 grid place-items-center rounded-full bg-sage text-primary shrink-0">
                                        <Icon className="w-4 h-4" />
                                    </span>
                                    <span className="text-sm text-foreground pt-1.5">{benefit.label}</span>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}

            <div className="my-6 h-px bg-border" />

            {/* Buy Directly CTA — new, independent of WhatsApp/Dynamic Button below */}
            {directCheckoutEnabled && productId && (
                <div className="mb-3">
                    <BuyNowButton
                        productId={productId}
                        productName={name}
                        productImage={mainImage || ""}
                        price={price}
                    />
                </div>
            )}

            {/* WhatsApp CTA */}
            <button
                onClick={handleWhatsAppClick}
                className="w-full flex items-center justify-center gap-3 h-14 rounded-full bg-whatsapp hover:brightness-110 text-white font-semibold uppercase tracking-[0.16em] text-[12px] transition shadow-card"
            >
                <MessageCircle className="w-5 h-5" />
                Contact via WhatsApp
            </button>

            {/* Dynamic Button */}
            {buttonText && buttonLink && (
                <button
                    onClick={() => window.open(buttonLink, '_blank')}
                    className="mt-3 w-full flex items-center justify-center h-14 rounded-full bg-primary hover:bg-primary-light text-primary-foreground font-semibold uppercase tracking-[0.16em] text-[12px] transition shadow-card"
                >
                    {buttonText}
                </button>
            )}
        </div>
    )
}

