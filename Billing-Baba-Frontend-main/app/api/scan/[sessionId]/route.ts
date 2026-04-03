import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'

// GET /api/scan/:sessionId — poll items
export async function GET(_req: NextRequest, { params }: { params: { sessionId: string } }) {
    const res = await fetch(`${BACKEND}/api/scan/session/${params.sessionId}`)
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}

// POST /api/scan/:sessionId — mobile adds barcode
export async function POST(req: NextRequest, { params }: { params: { sessionId: string } }) {
    const body = await req.json()
    const res = await fetch(`${BACKEND}/api/scan/session/${params.sessionId}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}

// DELETE /api/scan/:sessionId — close session
export async function DELETE(_req: NextRequest, { params }: { params: { sessionId: string } }) {
    const res = await fetch(`${BACKEND}/api/scan/session/${params.sessionId}`, { method: 'DELETE' })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}
