import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)

const createLinkSchema = z.object({
    url: z.string().url({ message: "Invalid URL" }),
    code: z.string().regex(/^[a-zA-Z0-9_-]*$/, "Code must be alphanumeric").min(3, "Code must be at least 3 characters").max(20, "Code must be at most 20 characters").optional().or(z.literal('')),
})

export async function GET() {
    try {
        const links = await prisma.link.findMany({
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json(links)
    } catch (error) {
        console.error('Failed to fetch links:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const result = createLinkSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.flatten() }, { status: 400 })
        }

        const { url, code } = result.data
        let shortCode = code

        if (shortCode) {
            // Check if exists
            const existing = await prisma.link.findUnique({ where: { shortCode } })
            if (existing) {
                return NextResponse.json({ error: 'Code already exists' }, { status: 409 })
            }
        } else {
            // Generate unique code
            let isUnique = false
            let attempts = 0
            while (!isUnique && attempts < 10) {
                shortCode = nanoid()
                const existing = await prisma.link.findUnique({ where: { shortCode } })
                if (!existing) isUnique = true
                attempts++
            }
            if (!isUnique) {
                return NextResponse.json({ error: 'Failed to generate unique code' }, { status: 500 })
            }
        }

        const link = await prisma.link.create({
            data: {
                originalUrl: url,
                shortCode: shortCode!,
            },
        })

        return NextResponse.json(link, { status: 201 })
    } catch (error) {
        console.error('Failed to create link:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
