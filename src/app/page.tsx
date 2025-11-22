import prisma from "@/lib/prisma"
import { LinkManager } from "@/components/dashboard/link-manager"

export const dynamic = 'force-dynamic'

export default async function Home() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const serializedLinks = links.map(link => ({
    ...link,
    createdAt: link.createdAt.toISOString(),
    lastClickedAt: link.lastClickedAt ? link.lastClickedAt.toISOString() : null,
    updatedAt: link.updatedAt.toISOString(),
  }))

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            TinyLink
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The premium URL shortener for modern needs. Track clicks, manage links, and share with style.
          </p>
        </div>

        <LinkManager initialLinks={serializedLinks} />
      </div>
    </main>
  )
}
