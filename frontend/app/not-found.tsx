import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center px-4">
                <div className="text-center max-w-2xl">
                    <h1 className="text-8xl md:text-9xl font-bold text-accent mb-4">404</h1>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Page Not Found</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Sorry, we couldn&apos;t find the page you&apos;re looking for.
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-8 py-3 bg-accent text-accent-foreground font-semibold rounded-full hover:bg-accent/90 transition duration-300 transform hover:scale-105"
                    >
                        Back to Home
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    )
}


