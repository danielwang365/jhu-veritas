import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import slugify from "slugify"

export async function GET() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    include: { author: { select: { id: true, name: true } }, category: true },
    orderBy: { publishedAt: "desc" },
  })
  return NextResponse.json(articles)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, body, excerpt, categoryId, status } = await req.json()

  if (!title || !body || !categoryId) {
    return NextResponse.json({ error: "Title, body, and category are required" }, { status: 400 })
  }

  // Generate unique slug
  let slug = slugify(title, { lower: true, strict: true })
  const existing = await prisma.article.findUnique({ where: { slug } })
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`
  }

  const article = await prisma.article.create({
    data: {
      title,
      slug,
      body,
      excerpt: excerpt || null,
      categoryId,
      authorId: session.user.id,
      status: status === "PENDING" ? "PENDING" : "DRAFT",
    },
  })

  return NextResponse.json(article, { status: 201 })
}
