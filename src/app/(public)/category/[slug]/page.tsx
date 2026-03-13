import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import type { Metadata } from "next"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await prisma.category.findUnique({ where: { slug } })
  if (!category) return { title: "Category Not Found" }
  return { title: category.name }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date)
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      articles: {
        where: { status: "PUBLISHED" },
        include: { author: true },
        orderBy: { publishedAt: "desc" },
      },
    },
  })

  if (!category) notFound()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-charcoal">{category.name}</h1>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {category.articles.map((article) => (
          <Link key={article.id} href={`/articles/${article.slug}`} className="group">
            <article className="border border-warm-gray rounded-lg p-6 h-full hover:border-charcoal/20 transition-colors">
              <h3 className="font-serif text-xl font-bold text-charcoal group-hover:text-accent transition-colors">
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
      {category.articles.length === 0 && (
        <p className="mt-8 text-charcoal/40">No articles in this category yet.</p>
      )}
    </div>
  )
}
