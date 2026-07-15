import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://auraava.com'
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    const currentDate = new Date().toISOString()

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about-us`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/hair-care-tips`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/faqs`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
    ]

    // Fetch dynamic pages (products and blog posts)
    try {
        // Fetch products
        const productsRes = await fetch(`${apiUrl}/api/products`, {
            next: { revalidate: 3600 }, // Revalidate every hour
        }).catch(() => null)
        
        let productPages: MetadataRoute.Sitemap = []
        if (productsRes?.ok) {
            const productsData = await productsRes.json()
            if (productsData?.products && Array.isArray(productsData.products)) {
                productPages = productsData.products.map((product: { id: string }) => ({
                    url: `${baseUrl}/products/${product.id}`,
                    lastModified: currentDate,
                    changeFrequency: 'weekly' as const,
                    priority: 0.7,
                }))
            }
        }

        // Fetch blog posts
        const blogsRes = await fetch(`${apiUrl}/api/blogs`, {
            next: { revalidate: 3600 }, // Revalidate every hour
        }).catch(() => null)
        
        let blogPages: MetadataRoute.Sitemap = []
        if (blogsRes?.ok) {
            const blogsData = await blogsRes.json()
            if (blogsData?.blogs && Array.isArray(blogsData.blogs)) {
                blogPages = blogsData.blogs.map((blog: { slug: string; publishedAt?: string }) => ({
                    url: `${baseUrl}/blog/${blog.slug}`,
                    lastModified: blog.publishedAt || currentDate,
                    changeFrequency: 'monthly' as const,
                    priority: 0.6,
                }))
            }
        }

        return [...staticPages, ...productPages, ...blogPages]
    } catch (error) {
        // If API calls fail, return at least static pages
        console.error('Error fetching dynamic sitemap data:', error)
        return staticPages
    }
}



