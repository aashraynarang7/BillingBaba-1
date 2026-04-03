import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'

export async function GET(_req: NextRequest, { params }: { params: { code: string } }) {
    try {
        const res = await fetch(
            `${BACKEND}/api/barcode/lookup/${encodeURIComponent(params.code)}`,
            { headers: { 'User-Agent': 'BillingBaba/1.0' } }
        )
        const data = await res.json()
        return NextResponse.json(data, { status: res.status })
    } catch (err: any) {
        return NextResponse.json({ found: false, barcode: params.code, name: '', brand: '', category: '', description: '', imageUrl: '', quantity: '', unit: '', mrp: 0, error: err.message }, { status: 200 })
    }
}
