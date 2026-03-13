import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { ArticleForm } from "@/components/dashboard/ArticleForm"

type Props = { params: Promise<{ id: string }> }

export default async function EditPage({ params }: Props) {
  const session = await auth()
  if (!session) redirect("/auth/login")

  const { id } = await params
  const article = await prisma.article.findUnique({
    where: { id },
  })

  if (!article) notFound()

  // Only author or admin can edit
  if (article.authorId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  })

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-charcoal mb-6">Edit Article</h1>
      <ArticleForm
        article={{
          id: article.id,
          title: article.title,
          body: article.body,
          excerpt: article.excerpt,
          categoryId: article.categoryId,
          status: article.status,
        }}
        categories={categories}
      />
    </div>
  )
}
