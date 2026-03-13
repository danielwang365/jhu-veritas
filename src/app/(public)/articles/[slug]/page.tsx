import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import sanitizeHtml from "sanitize-html"
import type { Metadata } from "next"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await prisma.article.findUnique({
    where: { slug, status: "PUBLISHED" },
  })
  if (!article) return { title: "Article Not Found" }
  return {
    title: article.title,
    description: article.excerpt || undefined,
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date)
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await prisma.article.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: { author: true, category: true },
  })

  if (!article) notFound()

  const cleanBody = sanitizeHtml(article.body, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title"],
      a: ["href", "target", "rel"],
    },
  })

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-8">
        <Link
          href={`/category/${article.category.slug}`}
          className="text-xs font-medium uppercase tracking-wider text-accent hover:text-charcoal transition-colors"
        >
          {article.category.name}
        </Link>
        <h1 className="mt-4 font-serif text-3xl md:text-5xl font-bold text-charcoal leading-tight">
          {article.title}
        </h1>
        <div className="mt-6 flex items-center gap-3 text-sm text-charcoal/50">
          <span className="font-medium text-charcoal/70">{article.author.name}</span>
          <span>·</span>
          <time>{formatDate(article.publishedAt!)}</time>
        </div>
      </div>

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: cleanBody }}
      />

      <div className="mt-12 pt-8 border-t border-warm-gray">
        <Link href="/archive" className="text-sm text-accent hover:text-charcoal transition-colors">
          ← Back to all articles
        </Link>
      </div>
    </article>
  )
}
