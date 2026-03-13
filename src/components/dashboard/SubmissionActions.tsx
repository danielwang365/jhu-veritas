"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export function SubmissionActions({ articleId }: { articleId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleAction(action: "PUBLISHED" | "REJECTED") {
    setLoading(true)
    const res = await fetch(`/api/articles/${articleId}/publish`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: action }),
    })
    if (res.ok) {
      router.refresh()
    } else {
      alert("Action failed")
    }
    setLoading(false)
  }

  return (
    <div className="flex gap-2 shrink-0">
      <button
        onClick={() => handleAction("PUBLISHED")}
        disabled={loading}
        className="px-4 py-2 text-sm font-medium text-green-700 border border-green-200 rounded-md hover:bg-green-50 transition-colors disabled:opacity-50"
      >
        Approve
      </button>
      <button
        onClick={() => handleAction("REJECTED")}
        disabled={loading}
        className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  )
}
