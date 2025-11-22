import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, MousePointer2, Link as LinkIcon } from "lucide-react"
import Link from "next/link"

export default async function StatsPage({ params }: { params: Promise<{ code: string }> }) {
    const code = (await params).code
    const link = await prisma.link.findUnique({
        where: { shortCode: code },
    })

    if (!link) {
        notFound()
    }

    return (
        <main className="min-h-screen bg-background p-8 flex items-center justify-center">
            <div className="max-w-2xl w-full space-y-8">
                <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Link>

                <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold flex items-center gap-2">
                            Stats for <span className="text-primary font-mono">/{link.shortCode}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MousePointer2 className="h-4 w-4" />
                                    <span className="text-sm font-medium">Total Clicks</span>
                                </div>
                                <p className="text-4xl font-bold">{link.clicks}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span className="text-sm font-medium">Created At</span>
                                </div>
                                <p className="text-lg font-medium">{link.createdAt.toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <LinkIcon className="h-4 w-4" />
                                <span className="text-sm font-medium">Original URL</span>
                            </div>
                            <div className="p-3 rounded-md bg-muted font-mono text-sm break-all">
                                {link.originalUrl}
                            </div>
                        </div>

                        {link.lastClickedAt && (
                            <div className="text-sm text-muted-foreground">
                                Last clicked: {link.lastClickedAt.toLocaleString()}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
