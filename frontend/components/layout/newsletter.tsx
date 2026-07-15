"use client"

export default function Newsletter() {
    return (
        <section className="bg-cream relative overflow-hidden">
            <span aria-hidden className="absolute -left-10 -top-10 text-[160px] opacity-10 select-none">🌿</span>
            <span aria-hidden className="absolute -right-10 -bottom-16 text-[180px] opacity-10 select-none">🌿</span>
            <div className="container-x py-16 text-center relative">
                <p className="eyebrow text-accent">Stay in our circle</p>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mt-3 text-primary">
                    Join the Auraava Circle
                </h2>
                <p className="mt-3 max-w-xl mx-auto text-muted-foreground">
                    Hair care rituals, ingredient stories and quiet offers — delivered to your inbox.
                </p>
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="mt-8 mx-auto max-w-md flex items-center gap-2 bg-white rounded-full p-1.5 shadow-card"
                >
                    <input
                        type="email"
                        required
                        placeholder="your@email.com"
                        className="flex-1 bg-transparent px-5 py-3 text-sm focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="px-6 h-11 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold uppercase tracking-[0.16em] hover:bg-primary-light transition"
                    >
                        Subscribe
                    </button>
                </form>
            </div>
        </section>
    )
}
