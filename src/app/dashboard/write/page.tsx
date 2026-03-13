import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ArticleForm } from "@/components/dashboard/ArticleForm"

export default async function WritePage() {
  const session = await auth()
  if (!session) redirect("/auth/login")

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  })

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-charcoal mb-6">Write New Article</h1>
      <ArticleForm categories={categories} />
    </div>
  )
}
