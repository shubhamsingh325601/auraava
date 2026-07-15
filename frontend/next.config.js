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
                    : 'http://localhost:5000/api/:path*',
            },
            {
                source: '/uploads/:path*',
                destination: process.env.NEXT_PUBLIC_API_URL
                    ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')}/uploads/:path*`
                    : 'http://localhost:5000/uploads/:path*',
            },
        ]
    },
}

module.exports = nextConfig

