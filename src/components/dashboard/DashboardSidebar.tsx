"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"

export function DashboardSidebar({ role }: { role: string }) {
  const pathname = usePathname()

  const links = [
    { href: "/dashboard", label: "My Articles" },
    { href: "/dashboard/write", label: "Write New" },
    ...(role === "ADMIN"
      ? [
          { href: "/dashboard/submissions", label: "Submissions" },
          { href: "/dashboard/users", label: "Users" },
        ]
      : []),
  ]

  return (
    <aside className="w-full md:w-56 shrink-0">
      <nav className="flex md:flex-col gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-4 py-2 text-sm rounded-md transition-colors",
              pathname === link.href
                ? "bg-charcoal text-white"
                : "text-charcoal/70 hover:text-charcoal hover:bg-warm-gray/50"
            )}
          >
            {link.label}
          </Link>
        ))}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-4 py-2 text-sm text-left text-charcoal/40 hover:text-charcoal transition-colors rounded-md mt-4"
        >
          Sign Out
        </button>
      </nav>
    </aside>
  )
}
