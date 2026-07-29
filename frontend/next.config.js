if (process.env.NODE_ENV === 'development') {
    try {
        const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev');
        setupDevPlatform();
    } catch { }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: process.env.NEXT_PUBLIC_API_URL
                    ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')}/api/:path*`
                    : 'https://api.auraava.com/api/:path*',
            },
            {
                source: '/uploads/:path*',
                destination: process.env.NEXT_PUBLIC_API_URL
                    ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')}/uploads/:path*`
                    : 'https://api.auraava.com/uploads/:path*',
            },
        ]
    },
}

module.exports = nextConfig

