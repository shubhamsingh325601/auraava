import FounderStoriesSection from "@/components/home/founder-stories"
import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import Newsletter from "@/components/layout/newsletter"
import PageHero from "@/components/layout/page-hero"

export default function OurStoryPage() {
    return (
        <>
            <Header />
            <PageHero
                eyebrow="Our Story"
                title="The Story Behind Auraava"
                description="Born from nature. Built for you."
                breadcrumb={[{ label: "Our Story" }]}
            />
            <FounderStoriesSection />
            <Newsletter />
            <Footer />
        </>
    )
}
