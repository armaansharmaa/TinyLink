import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const code = (await params).code
        const link = await prisma.link.findUnique({
            where: { shortCode: code },
        })

        if (!link) {
            return new NextResponse('Not Found', { status: 404 })
        }

        // Increment clicks asynchronously (fire and forget for speed, or await for consistency)
        // For analytics accuracy, we should await, but for speed, we might not.
        // Given the requirements, we'll await to ensure it's counted.
        await prisma.link.update({
            where: { id: link.id },
            data: {
                clicks: { increment: 1 },
                lastClickedAt: new Date(),
            },
        })

        return NextResponse.redirect(link.originalUrl)
    } catch (error) {
        console.error('Redirect error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
