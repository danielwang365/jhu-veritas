"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

const TiptapEditor = dynamic(() => import("@/components/editor/TiptapEditor"), {
  ssr: false,
  loading: () => <div className="h-[400px] border border-warm-gray rounded-md animate-pulse bg-white" />,
})

interface Category {
  id: string
  name: string
}

interface ArticleFormProps {
  article?: {
    id: string
    title: string
    body: string
    excerpt: string | null
    categoryId: string
    status: string
  }
  categories: Category[]
}

export function ArticleForm({ article, categories }: ArticleFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(article?.title ?? "")
  const [body, setBody] = useState(article?.body ?? "")
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "")
  const [categoryId, setCategoryId] = useState(article?.categoryId ?? categories[0]?.id ?? "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(status: "DRAFT" | "PENDING") {
    if (!title.trim() || !body.trim()) {
      setError("Title and body are required")
      return
    }
    setLoading(true)
    setError("")

    const url = article ? `/api/articles/${article.id}` : "/api/articles"
    const method = article ? "PATCH" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, excerpt: excerpt || undefined, categoryId, status }),
    })

    if (res.ok) {
      router.push("/dashboard")
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-charcoal/70 mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article title"
          className="w-full px-3 py-2.5 bg-white border border-warm-gray rounded-md text-lg font-serif focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-charcoal/70 mb-1">
          Excerpt <span className="text-charcoal/40">(optional)</span>
        </label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="A brief summary of your article..."
          rows={2}
          className="w-full px-3 py-2.5 bg-white border border-warm-gray rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-charcoal/70 mb-1">
          Category
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-3 py-2.5 bg-white border border-warm-gray rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal/70 mb-1">Content</label>
        <TiptapEditor content={body} onChange={setBody} />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={() => handleSubmit("DRAFT")}
          disabled={loading}
          className="px-6 py-2.5 text-sm font-medium text-charcoal border border-warm-gray rounded-md hover:border-charcoal/30 transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Draft"}
        </button>
        <button
          type="button"
          onClick={() => handleSubmit("PENDING")}
          disabled={loading}
          className="px-6 py-2.5 text-sm font-medium text-white bg-charcoal rounded-md hover:bg-charcoal/90 transition-colors disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit for Review"}
        </button>
      </div>
    </div>
  )
}
