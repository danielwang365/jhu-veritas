import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || ""
    let email: string

    if (contentType.includes("application/json")) {
      const body = await req.json()
      email = body.email
    } else {
      // Handle form submission
      const formData = await req.formData()
      email = formData.get("email") as string
    }

    if (!email || !email.includes("@")) {
      // For form submissions, redirect back with error
      if (!contentType.includes("application/json")) {
        return NextResponse.redirect(new URL("/?subscribed=error", req.url))
      }
      return NextResponse.json({ error: "Valid email required" }, { status: 400 })
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    })

    // For form submissions, redirect back with success
    if (!contentType.includes("application/json")) {
      return NextResponse.redirect(new URL("/?subscribed=true", req.url))
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
