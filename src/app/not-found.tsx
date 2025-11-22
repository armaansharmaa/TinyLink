import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-4 text-center p-4">
            <h2 className="text-4xl font-bold">404 - Not Found</h2>
            <p className="text-muted-foreground">Could not find the requested resource.</p>
            <Button asChild>
                <Link href="/">Return Home</Link>
            </Button>
        </div>
    )
}
