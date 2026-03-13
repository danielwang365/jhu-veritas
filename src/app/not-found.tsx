import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="font-serif text-6xl font-bold text-charcoal">404</h1>
      <p className="mt-4 text-lg text-charcoal/60">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        href="/"
        className="mt-8 px-6 py-2.5 text-sm font-medium text-white bg-charcoal rounded-md hover:bg-charcoal/90 transition-colors"
      >
        Go Home
      </Link>
    </div>
  )
}
