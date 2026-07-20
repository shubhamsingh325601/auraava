import type { Metadata } from "next"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import HairQuizModal from "@/components/home/hair-quiz-modal"
import WhatsAppButton from "@/components/layout/whatsapp-button"

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://auraava.com'),
    title: {
        default: "Auraava - Natural Hair Care Products",
        template: "%s | Auraava"
    },
    description: "Natural hair care products with pure ingredients. Organic, cruelty-free shampoos, oils, serums, and sprays for radiant hair.",
    keywords: [
        "hair care", 
        "natural products", 
        "organic hair care", 
        "shampoo", 
        "hair oil", 
        "hair serum", 
        "hair spray",
        "cruelty-free",
        "Auraava",
        "natural hair products",
        "organic shampoo",
        "hair treatment",
        "hair care tips"
    ],
    authors: [{ name: "Auraava" }],
    creator: "Auraava",
    publisher: "Auraava",
    icons: {
        icon: "/bgimage/logo2.png",
        apple: "/bgimage/logo2.png",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://auraava.com',
        siteName: "Auraava",
        title: "Auraava - Natural Hair Care Products",
        description: "Natural hair care products with pure ingredients. Organic, cruelty-free shampoos, oils, serums, and sprays.",
        images: [
            {
                url: "/bgimage/logo2.png",
                width: 1200,
                height: 630,
                alt: "Auraava - Natural Hair Care Products",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Auraava - Natural Hair Care Products",
        description: "Natural hair care products with pure ingredients. Organic, cruelty-free.",
        images: ["/bgimage/logo2.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        // Add your verification codes here when available
        // google: 'your-google-verification-code',
        // yandex: 'your-yandex-verification-code',
        // bing: 'your-bing-verification-code',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="overflow-x-hidden">
            <head>
                <link rel="icon" href="/bgimage/logo2.png" />
                <link rel="apple-touch-icon" href="/bgimage/logo2.png" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
                <meta name="theme-color" content="#C8DDD0" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            "name": "Auraava",
                            "url": process.env.NEXT_PUBLIC_SITE_URL || "https://auraava.com",
                            "logo": `${process.env.NEXT_PUBLIC_SITE_URL || "https://auraava.com"}/bgimage/logo2.png`,
                            "description": "Pure ingredients for radiant hair and skin. Discover our collection of nature-infused, ethically sourced, cruelty-free hair care products.",
                            "sameAs": [
                                "https://www.facebook.com/auraavacare",
                                "https://www.instagram.com/auraavacare",
                                "https://www.youtube.com/@auraavacare",
                                "https://twitter.com/auraavacare",
                                "https://www.linkedin.com/company/auraavacare"
                            ],
                            "contactPoint": {
                                "@type": "ContactPoint",
                                "telephone": "+91-9718370125",
                                "contactType": "customer service",
                                "email": "customer@auraava.com"
                            }
                        })
                    }}
                />
            </head>
            <body className="overflow-x-hidden">
                <CartProvider>{children}</CartProvider>
                <HairQuizModal />
                <WhatsAppButton />
            </body>
        </html>
    )
}


