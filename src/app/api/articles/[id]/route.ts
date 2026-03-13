import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import slugify from "slugify"

type Props = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Props) {
  const { id } = await params
  const article = await prisma.article.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true } }, category: true },
  })

  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(article)
}

export async function PATCH(req: NextRequest, { params }: Props) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const article = await prisma.article.findUnique({ where: { id } })

  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Only author or admin can edit
  if (article.authorId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { title, body, excerpt, categoryId, status } = await req.json()

  const data: Record<string, unknown> = {}
  if (title !== undefined) {
    data.title = title
    // Regenerate slug if title changed
    let slug = slugify(title, { lower: true, strict: true })
    const existing = await prisma.article.findFirst({
      where: { slug, id: { not: id } },
    })
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`
    }
    data.slug = slug
  }
  if (body !== undefined) data.body = body
  if (excerpt !== undefined) data.excerpt = excerpt || null
  if (categoryId !== undefined) data.categoryId = categoryId
  if (status !== undefined) {
    // Members can only set DRAFT or PENDING
    if (session.user.role !== "ADMIN" && !["DRAFT", "PENDING"].includes(status)) {
      return NextResponse.json({ error: "Forbidden status" }, { status: 403 })
    }
    data.status = status
  }

  const updated = await prisma.article.update({
    where: { id },
    data,
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: Props) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const article = await prisma.article.findUnique({ where: { id } })

  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Only author or admin can delete
  if (article.authorId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await prisma.article.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
