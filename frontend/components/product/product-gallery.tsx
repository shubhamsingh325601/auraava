"use client"

import { useState } from "react"
import Image from "next/image"

interface ProductGalleryProps {
    images: string[]
    productName: string
    bestSeller?: boolean
}

export default function ProductGallery({ images, productName, bestSeller }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0)

    return (
        <div>
            {/* Main Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-white shadow-card group">
                <Image
                    src={images[selectedImage]}
                    alt={productName}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {bestSeller && (
                    <div className="absolute top-4 -left-10 rotate-[-35deg] bg-accent-gold text-white text-[10px] uppercase tracking-[0.18em] font-semibold px-12 py-1 shadow-card">
                        ✦ Bestseller
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            aria-label={`Show ${productName} image ${index + 1}`}
                            className={`relative aspect-square rounded-lg overflow-hidden bg-white border-2 transition ${selectedImage === index
                                ? "border-primary"
                                : "border-transparent hover:border-border"
                                }`}
                        >
                            <Image
                                src={image}
                                alt={`${productName} view ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}


