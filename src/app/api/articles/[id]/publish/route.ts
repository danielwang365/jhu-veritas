import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

type Props = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Props) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const { status, featured } = await req.json()

  if (!["PUBLISHED", "REJECTED"].includes(status) && featured === undefined) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  const data: Record<string, unknown> = {}
  if (status) {
    data.status = status
    if (status === "PUBLISHED") {
      data.publishedAt = new Date()
    }
  }
  if (featured !== undefined) {
    data.featured = featured
  }

  const article = await prisma.article.update({
    where: { id },
    data,
  })

  return NextResponse.json(article)
}
