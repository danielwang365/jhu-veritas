import Link from "next/link"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date)
}

export default async function HomePage() {
  const featuredArticle = await prisma.article.findFirst({
    where: { status: "PUBLISHED", featured: true },
    include: { author: true, category: true },
    orderBy: { publishedAt: "desc" },
  })

  const recentArticles = await prisma.article.findMany({
    where: { status: "PUBLISHED", id: { not: featuredArticle?.id ?? "" } },
    include: { author: true, category: true },
    orderBy: { publishedAt: "desc" },
    take: 6,
  })

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  })

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        <h1 className="font-serif text-4xl md:text-6xl font-bold text-charcoal leading-tight">
          Veritas Forum<br />at JHU
        </h1>
        <p className="mt-6 text-lg text-charcoal/60 max-w-2xl mx-auto">
          Exploring truth, meaning, and faith through thoughtful writing from the Johns Hopkins community.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="px-4 py-1.5 text-sm rounded-full border border-warm-gray text-charcoal/60 hover:text-charcoal hover:border-charcoal/30 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Link href={`/articles/${featuredArticle.slug}`} className="block group">
            <div className="border border-warm-gray rounded-lg p-8 md:p-12 hover:border-charcoal/20 transition-colors">
              <span className="text-xs font-medium uppercase tracking-wider text-accent">
                Featured · {featuredArticle.category.name}
              </span>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl font-bold text-charcoal group-hover:text-accent transition-colors">
                {featuredArticle.title}
              </h2>
              {featuredArticle.excerpt && (
                <p className="mt-4 text-lg text-charcoal/60 max-w-3xl">
                  {featuredArticle.excerpt}
                </p>
              )}
              <p className="mt-6 text-sm text-charcoal/40">
                {featuredArticle.author.name} · {formatDate(featuredArticle.publishedAt!)}
              </p>
            </div>
          </Link>
        </section>
      )}

      {/* Recent Articles */}
      {recentArticles.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="font-serif text-2xl font-bold text-charcoal mb-8">Recent Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentArticles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`} className="group">
                <article className="border border-warm-gray rounded-lg p-6 h-full hover:border-charcoal/20 transition-colors">
                  <span className="text-xs font-medium uppercase tracking-wider text-accent">
                    {article.category.name}
                  </span>
                  <h3 className="mt-3 font-serif text-xl font-bold text-charcoal group-hover:text-accent transition-colors">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="mt-2 text-sm text-charcoal/60 line-clamp-3">
                      {article.excerpt}
                    </p>
                  )}
                  <p className="mt-4 text-xs text-charcoal/40">
                    {article.author.name} · {formatDate(article.publishedAt!)}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty state when no articles */}
      {!featuredArticle && recentArticles.length === 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 text-center">
          <p className="text-charcoal/40 text-lg">No articles published yet. Check back soon.</p>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="border-t border-warm-gray">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="font-serif text-2xl font-bold text-charcoal">Stay in the Conversation</h2>
          <p className="mt-3 text-charcoal/60">Subscribe to receive new articles in your inbox.</p>
          <form action="/api/newsletter" method="POST" className="mt-6 flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              required
              className="flex-1 px-4 py-2.5 text-sm bg-white border border-warm-gray rounded-md focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
            />
            <button type="submit" className="px-6 py-2.5 text-sm font-medium text-white bg-charcoal rounded-md hover:bg-charcoal/90 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
