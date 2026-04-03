import { NextResponse } from 'next/server'

const BACKEND = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'

export async function POST() {
    const res = await fetch(`${BACKEND}/api/scan/session`, { method: 'POST' })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}
