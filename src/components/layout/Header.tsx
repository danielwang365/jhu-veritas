"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-warm-gray">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-serif text-2xl font-bold tracking-wider text-charcoal">
            VERITAS
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/archive" className="text-sm font-medium text-charcoal/70 hover:text-charcoal transition-colors">
              Articles
            </Link>
            <Link href="/about" className="text-sm font-medium text-charcoal/70 hover:text-charcoal transition-colors">
              About
            </Link>
            {session ? (
              <Link href="/dashboard" className="text-sm font-medium text-accent hover:text-charcoal transition-colors">
                Dashboard
              </Link>
            ) : (
              <Link href="/auth/login" className="text-sm font-medium text-accent hover:text-charcoal transition-colors">
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-charcoal"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-warm-gray">
            <nav className="flex flex-col gap-2 pt-4">
              <Link href="/archive" className="px-2 py-2 text-sm font-medium text-charcoal/70 hover:text-charcoal" onClick={() => setMobileMenuOpen(false)}>
                Articles
              </Link>
              <Link href="/about" className="px-2 py-2 text-sm font-medium text-charcoal/70 hover:text-charcoal" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              {session ? (
                <Link href="/dashboard" className="px-2 py-2 text-sm font-medium text-accent hover:text-charcoal" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </Link>
              ) : (
                <Link href="/auth/login" className="px-2 py-2 text-sm font-medium text-accent hover:text-charcoal" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
