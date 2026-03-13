"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function CreateUserForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("MEMBER")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    })

    if (res.ok) {
      setSuccess(`Account created for ${email}`)
      setName("")
      setEmail("")
      setPassword("")
      setRole("MEMBER")
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || "Failed to create user")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          className="px-3 py-2 bg-white border border-warm-gray rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="px-3 py-2 bg-white border border-warm-gray rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Temporary password"
          required
          minLength={8}
          className="px-3 py-2 bg-white border border-warm-gray rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-3 py-2 bg-white border border-warm-gray rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
        >
          <option value="MEMBER">Member</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 text-sm font-medium text-white bg-charcoal rounded-md hover:bg-charcoal/90 transition-colors disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Account"}
      </button>
    </form>
  )
}
