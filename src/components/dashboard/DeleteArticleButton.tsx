"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteArticleButton({ articleId }: { articleId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this article?")) return
    setLoading(true)
    const res = await fetch(`/api/articles/${articleId}`, { method: "DELETE" })
    if (res.ok) {
      router.refresh()
    } else {
      alert("Failed to delete article")
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      {loading ? "..." : "Delete"}
    </button>
  )
}
