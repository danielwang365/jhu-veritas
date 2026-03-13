import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { SubmissionActions } from "@/components/dashboard/SubmissionActions"

export default async function SubmissionsPage() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard")

  const pendingArticles = await prisma.article.findMany({
    where: { status: "PENDING" },
    include: { author: true, category: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-charcoal mb-6">Pending Submissions</h1>

      {pendingArticles.length === 0 ? (
        <div className="text-center py-12 border border-warm-gray rounded-lg">
          <p className="text-charcoal/40">No pending submissions.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingArticles.map((article) => (
            <div key={article.id} className="p-6 border border-warm-gray rounded-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-lg font-bold text-charcoal">{article.title}</h3>
                  <p className="text-sm text-charcoal/50 mt-1">
                    by {article.author.name} · {article.category.name} · {new Date(article.createdAt).toLocaleDateString()}
                  </p>
                  {article.excerpt && (
                    <p className="text-sm text-charcoal/60 mt-2">{article.excerpt}</p>
                  )}
                </div>
                <SubmissionActions articleId={article.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
