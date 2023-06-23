import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest,) {
    console.log(request.url)
    return NextResponse.json({ message: 'Hello from the paid route!' })
}