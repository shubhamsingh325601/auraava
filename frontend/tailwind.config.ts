import type { Config } from "tailwindcss"

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
                serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
            },
            colors: {
                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "var(--primary-foreground)",
                    light: "var(--primary-light)",
                    soft: "var(--primary-soft)",
                },
                secondary: {
                    DEFAULT: "var(--secondary)",
                    foreground: "var(--secondary-foreground)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--accent-foreground)",
                    gold: "var(--accent-gold)",
                    blush: "var(--accent-blush)",
                    brown: "var(--accent-brown)",
                    mint: "var(--accent-mint)",
                },
                muted: {
                    DEFAULT: "var(--muted)",
                    foreground: "var(--muted-foreground)",
                },
                card: {
                    DEFAULT: "var(--card)",
                    foreground: "var(--card-foreground)",
                },
                destructive: {
                    DEFAULT: "var(--destructive)",
                    foreground: "var(--destructive-foreground)",
                },
                cream: "var(--bg-cream)",
                sage: "var(--bg-sage)",
                deep: "var(--bg-deep)",
                blush: "var(--bg-blush)",
                tan: "var(--bg-tan)",
                ivory: "var(--bg-base)",
                "nav-top": "var(--nav-top)",
                "nav-secondary": "var(--nav-secondary)",
                "product-price": "var(--product-price)",
                "rating-star": "var(--rating-star)",
                whatsapp: "var(--whatsapp)",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                xl: "calc(var(--radius) + 4px)",
                "2xl": "calc(var(--radius) + 8px)",
            },
            boxShadow: {
                card: "0 4px 24px rgba(44, 62, 45, 0.08)",
                hover: "0 12px 44px rgba(44, 62, 45, 0.16)",
            },
            keyframes: {
                "fade-in": {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
                "slide-in-from-bottom": {
                    from: { transform: "translateY(10px)", opacity: "0" },
                    to: { transform: "translateY(0)", opacity: "1" },
                },
                marquee: {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(-50%)" },
                },
                "fade-up": {
                    from: { opacity: "0", transform: "translateY(24px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "fade-in": "fade-in 0.5s ease-in-out",
                "slide-in": "slide-in-from-bottom 0.5s ease-in-out",
                marquee: "marquee 38s linear infinite",
                "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [],
}
export default config
