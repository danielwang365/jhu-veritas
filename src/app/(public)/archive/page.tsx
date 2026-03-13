import Link from "next/link"
import { prisma } from "@/lib/prisma"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Archive",
  description: "Browse all articles from the Veritas Forum at JHU",
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date)
}

export default async function ArchivePage() {
  const [articles, categories] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      include: { author: true, category: true },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-charcoal">All Articles</h1>

      {/* Category tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        <span className="px-4 py-1.5 text-sm rounded-full bg-charcoal text-white">All</span>
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

      {/* Articles grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <Link key={article.id} href={`/articles/${article.slug}`} className="group">
            <article className="border border-warm-gray rounded-lg p-6 h-full hover:border-charcoal/20 transition-colors">
              <span className="text-xs font-medium uppercase tracking-wider text-accent">
                {article.category.name}
              </span>
              <h3 className="mt-3 font-serif text-xl font-bold text-charcoal group-hover:text-accent transition-colors">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="mt-2 text-sm text-charcoal/60 line-clamp-3">{article.excerpt}</p>
              )}
              <p className="mt-4 text-xs text-charcoal/40">
                {article.author.name} · {formatDate(article.publishedAt!)}
              </p>
            </article>
          </Link>
        ))}
      </div>

      {articles.length === 0 && (
        <p className="mt-8 text-charcoal/40 text-center">No articles published yet.</p>
      )}
    </div>
  )
}
