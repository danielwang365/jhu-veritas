import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"
import { DeleteArticleButton } from "@/components/dashboard/DeleteArticleButton"

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  PENDING: "bg-yellow-50 text-yellow-700",
  PUBLISHED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/auth/login")

  const articles = await prisma.article.findMany({
    where: { authorId: session.user.id },
    include: { category: true },
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-charcoal">My Articles</h1>
        <Link
          href="/dashboard/write"
          className="px-4 py-2 text-sm font-medium text-white bg-charcoal rounded-md hover:bg-charcoal/90 transition-colors"
        >
          Write New
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12 border border-warm-gray rounded-lg">
          <p className="text-charcoal/40">You haven&apos;t written any articles yet.</p>
          <Link href="/dashboard/write" className="mt-4 inline-block text-sm text-accent hover:text-charcoal">
            Start writing →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <div key={article.id} className="flex items-center justify-between p-4 border border-warm-gray rounded-lg">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-charcoal truncate">{article.title}</h3>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[article.status]}`}>
                    {article.status}
                  </span>
                </div>
                <p className="text-xs text-charcoal/40 mt-1">
                  {article.category.name} · Updated {new Date(article.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Link
                  href={`/dashboard/edit/${article.id}`}
                  className="px-3 py-1.5 text-xs font-medium text-charcoal/70 border border-warm-gray rounded-md hover:border-charcoal/30 transition-colors"
                >
                  Edit
                </Link>
                <DeleteArticleButton articleId={article.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
