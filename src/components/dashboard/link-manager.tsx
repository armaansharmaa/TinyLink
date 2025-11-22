"use client"

import { useState, useEffect } from "react"
import { Link } from "@prisma/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Copy, Trash2, BarChart2, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type SerializedLink = Omit<Link, "createdAt" | "lastClickedAt" | "updatedAt"> & {
    createdAt: string
    lastClickedAt: string | null
    updatedAt: string
}

export function LinkManager({ initialLinks }: { initialLinks: SerializedLink[] }) {
    const [links, setLinks] = useState<SerializedLink[]>(initialLinks)
    const [url, setUrl] = useState("")
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [origin, setOrigin] = useState("")

    useEffect(() => {
        setOrigin(window.location.origin)
    }, [])

    const filteredLinks = links.filter(l =>
        l.shortCode.toLowerCase().includes(search.toLowerCase()) ||
        l.originalUrl.toLowerCase().includes(search.toLowerCase())
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!url) return

        setLoading(true)
        try {
            const res = await fetch("/api/links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, code }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Failed to create link")
            }

            const newLink = await res.json()
            setLinks([newLink, ...links])
            setUrl("")
            setCode("")
            toast.success("Link created successfully!")
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (code: string) => {
        if (!confirm("Are you sure you want to delete this link?")) return

        try {
            const res = await fetch(`/api/links/${code}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Failed to delete")

            setLinks(links.filter(l => l.shortCode !== code))
            toast.success("Link deleted")
        } catch (error) {
            toast.error("Failed to delete link")
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard!")
    }

    return (
        <div className="space-y-8">
            <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">Create New Link</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                        <Input
                            placeholder="https://example.com/very-long-url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                            className="flex-1"
                        />
                        <div className="flex gap-2">
                            <Input
                                placeholder="custom-code (opt)"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-40"
                            />
                            <Button type="submit" disabled={loading}>
                                {loading ? "Creating..." : "Shorten"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Your Links</h2>
                    <Input
                        placeholder="Search links..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-xs"
                    />
                </div>

                <div className="grid gap-4">
                    <AnimatePresence>
                        {filteredLinks.map((link) => (
                            <motion.div
                                key={link.shortCode}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                layout
                            >
                                <Card className="overflow-hidden transition-all hover:shadow-md border-l-4 border-l-primary">
                                    <CardContent className="p-4 flex items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0 grid gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold text-lg text-primary">/{link.shortCode}</span>
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(`${origin}/${link.shortCode}`)}>
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                                <a href={`/${link.shortCode}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate" title={link.originalUrl}>{link.originalUrl}</p>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                                <span className="flex items-center gap-1"><BarChart2 className="h-3 w-3" /> {link.clicks} clicks</span>
                                                <span suppressHydrationWarning>{new Date(link.createdAt).toLocaleDateString()}</span>
                                                {link.lastClickedAt && (
                                                    <span suppressHydrationWarning className="hidden sm:inline border-l pl-4 border-border/50">
                                                        Last clicked: {new Date(link.lastClickedAt).toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={`/code/${link.shortCode}`} className="flex items-center gap-1">
                                                    Stats
                                                </a>
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(link.shortCode)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {filteredLinks.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            No links found. Create one above!
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
