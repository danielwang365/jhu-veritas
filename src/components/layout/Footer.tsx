import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-warm-gray bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-xl font-bold tracking-wider text-charcoal">VERITAS</h3>
            <p className="mt-2 text-sm text-charcoal/60">
              Exploring truth, meaning, and faith at Johns Hopkins University.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-charcoal/40 mb-4">Explore</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/archive" className="text-sm text-charcoal/70 hover:text-charcoal transition-colors">
                Articles
              </Link>
              <Link href="/about" className="text-sm text-charcoal/70 hover:text-charcoal transition-colors">
                About
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-charcoal/40 mb-4">Stay Updated</h4>
            <p className="text-sm text-charcoal/60 mb-3">Get new articles delivered to your inbox.</p>
            <form action="/api/newsletter" method="POST" className="flex gap-2">
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                required
                className="flex-1 px-3 py-2 text-sm bg-white border border-warm-gray rounded-md focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-charcoal rounded-md hover:bg-charcoal/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-warm-gray">
          <p className="text-sm text-charcoal/40 text-center">
            &copy; {new Date().getFullYear()} Veritas Forum at JHU. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
