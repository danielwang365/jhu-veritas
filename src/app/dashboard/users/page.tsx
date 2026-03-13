import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { CreateUserForm } from "@/components/dashboard/CreateUserForm"

export default async function UsersPage() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard")

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-charcoal mb-6">Manage Users</h1>

      <div className="mb-8 p-6 border border-warm-gray rounded-lg">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-charcoal/40 mb-4">Create New Member</h2>
        <CreateUserForm />
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-4 border border-warm-gray rounded-lg">
            <div>
              <p className="font-medium text-charcoal">{user.name}</p>
              <p className="text-sm text-charcoal/50">{user.email}</p>
            </div>
            <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
              user.role === "ADMIN" ? "bg-purple-50 text-purple-700" : "bg-gray-100 text-gray-700"
            }`}>
              {user.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
